import { Router } from "express";
import { createProductService } from "../../services/product.service";
import { Resource, ResourceCollection } from "../../http/resource";
import cors from "cors";
import { defaultCorsOptions } from "../../http/cors";
const router = Router();

const corsCollection = cors({
  ...defaultCorsOptions,
  methods: ["GET", "POST"],
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ["GET", "PATCH", "DELETE"],
});

router.post("/", corsCollection, async (req, res, next) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  try {
    const product = await productService.createProduct(
      name,
      slug,
      description,
      price,
      categoryIds
    );
    res.set("Location", `/admin/products/${product.id}`).status(201);
    const resource = new Resource(product);
    next(resource);
  } catch (e) {
    next(e);
  }
});

router.get("/:productId", corsItem, async (req, res) => {
  const productService = await createProductService();
  const product = await productService.getProductById(+req.params.productId);
  if (!product) {
    return res.status(404).json({
      title: "Not Found",
      status: 404,
      detail: `Product with id ${req.params.productId} not found`,
    });
  }
  const resource = new Resource(product);
  res.json(resource);
});

router.patch("/:productId", corsItem, async (req, res) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.updateProduct({
    id: +req.params.productId,
    name,
    slug,
    description,
    price,
    categoryIds,
  });
  const resource = new Resource(product);
  res.json(resource);
});

router.delete("/:productId", corsItem, async (req, res) => {
  const productService = await createProductService();
  await productService.deleteProduct(+req.params.productId);
  res.status(204).send();
});

router.get("/", corsCollection, async (req, res, next) => {
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

  if (
    !req.headers["accept"] ||
    req.headers["accept"] === "*/*" ||
    req.headers["accept"] === "application/json"
  ) {
    const collection = new ResourceCollection(products, {
      paginationData: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
    return next(collection);
  }

  if (req.headers["accept"] === "text/csv") {
    const csv = products
      .map((product) => {
        return `${product.name},${product.slug},${product.description},${product.price}`;
      })
      .join("\n");
    res.set("Content-Type", "text/csv");
    return res.send(csv);
  }
});

router.options("/", corsCollection);
router.options("/:productId", corsItem);

export default router;