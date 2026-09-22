const pool = require('../config/db');

exports.getRecommendations = async (req, res, next) => {
  try {
    const { categoryId, budget, capacity, brand, minRating, energyRating, features } = req.body;

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'categoryId is required' });
    }

    // Fetch all products in the category with full details
    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.stock_status != 'out_of_stock'`,
      [categoryId]
    );

    // Fetch features for scoring
    for (const product of products) {
      const [pFeatures] = await pool.query(
        'SELECT feature_text FROM product_features WHERE product_id = ? AND feature_type = ?',
        [product.id, 'feature']
      );
      product.featureList = pFeatures.map(f => f.feature_text.toLowerCase());
    }

    const scoredProducts = products.map(product => {
      let score = 0;
      const matchingReasons = [];

      // Budget match: 30 points if within budget, 15 if within 10% over
      if (budget && Number(budget) > 0) {
        if (product.price <= Number(budget)) {
          score += 30;
          matchingReasons.push(`Fits within your budget of ₹${Number(budget).toLocaleString('en-IN')}`);
        } else if (product.price <= Number(budget) * 1.1) {
          score += 15;
          matchingReasons.push('Slightly above budget but worth considering');
        }
      }

      // Brand match: 15 points
      if (brand && brand.trim() && product.brand.toLowerCase() === brand.toLowerCase().trim()) {
        score += 15;
        matchingReasons.push(`Matches preferred brand: ${product.brand}`);
      }

      // Rating match: 20 points
      if (minRating && Number(minRating) > 0) {
        if (product.average_rating >= Number(minRating)) {
          score += 20;
          matchingReasons.push(`Rating ${product.average_rating}⭐ meets your requirement of ${minRating}⭐`);
        }
      } else if (product.average_rating >= 4) {
        score += 10;
        matchingReasons.push(`Highly rated at ${product.average_rating}⭐`);
      }

      // Energy rating match: 15 points
      if (energyRating && Number(energyRating) > 0) {
        if (product.energy_rating >= Number(energyRating)) {
          score += 15;
          matchingReasons.push(`${product.energy_rating}-star energy rating meets your requirement`);
        }
      }

      // Capacity match: 10 points
      if (capacity && capacity.trim() && product.capacity) {
        const capLower = capacity.toLowerCase();
        const productCap = product.capacity.toLowerCase();
        if (productCap.includes(capLower) || capLower.includes(productCap.replace(/[^0-9]/g, ''))) {
          score += 10;
          matchingReasons.push(`Capacity ${product.capacity} matches your requirement`);
        }
      }

      // Feature match: up to 10 points (5 per feature matched)
      if (features && Array.isArray(features) && features.length > 0) {
        let featureScore = 0;
        const matchedFeatures = [];
        features.forEach(reqFeature => {
          const reqLower = reqFeature.toLowerCase();
          if (product.featureList.some(f => f.includes(reqLower) || reqLower.includes(f))) {
            featureScore = Math.min(featureScore + 5, 10);
            matchedFeatures.push(reqFeature);
          }
        });
        if (featureScore > 0) {
          score += featureScore;
          matchingReasons.push(`Features matched: ${matchedFeatures.join(', ')}`);
        }
      }

      const maxPossibleScore = 100;
      const matchPercentage = Math.min(Math.round((score / maxPossibleScore) * 100), 100);

      return {
        ...product,
        featureList: undefined, // remove internal field
        score,
        matchPercentage,
        matchingReasons
      };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

    res.status(200).json({ success: true, data: scoredProducts });
  } catch (error) {
    next(error);
  }
};
