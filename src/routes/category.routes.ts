import { Router } from "express";
import { createCategoryService } from "../services/category.service";
import { defaultCorsOptions } from "../http/cors";
import cors from "cors";

const corsCollection = cors({
  ...defaultCorsOptions,
  methods: ["GET"],
});

const corsItem = corsCollection;

const router = Router();

router.get("/:categorySlug", corsItem, async (req, res) => {
  const categoryService = await createCategoryService();
  const category = await categoryService.getCategoryBySlug(
    req.params.categorySlug
  );
  res.json(category);
});

router.get("/", corsCollection, async (req, res) => {
  const categoryService = await createCategoryService();
  const { page = 1, limit = 10, name } = req.query;
  const { categories, total } = await categoryService.listCategories({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: { name: name as string },
  });
  res.set("Cache-Control", `max-age=${20}`);
  res.json({ categories, total });
});

router.options(
  "/",
  cors({
    ...defaultCorsOptions,
    methods: ["GET"],
  })
);

router.options(
  "/:categorySlug",
  cors({
    ...defaultCorsOptions,
    methods: ["GET"],
  })
);

export default router;