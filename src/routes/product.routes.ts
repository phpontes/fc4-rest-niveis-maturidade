import { Router } from "express";
import { createProductService } from "../services/product.service";

const router = Router();

router.get("/:productSlug", async (req, res) => {
  const productService = await createProductService(); 
  const product = await productService.getProductBySlug(
    req.params.productSlug as string
  );
  res.json(product);
});

router.get("/", async (req, res) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });

  // if(req.headers['if-modified-since'] === new Date().toUTCString()) {
  //   res.set('Last-Modified', new Date().toUTCString());
  //   res.set('Cache-Control', 'public, max-age=60');
  //   res.status(304).end();
  //   return
  // }

  // res.set('Last-Modified', new Date().toUTCString());
  res.json({ products, total });
});

export default router;