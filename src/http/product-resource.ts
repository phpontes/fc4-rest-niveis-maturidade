import { Request } from "express";
import { Product } from "../entities/Product";
import { Link, Resource, ResourceCollection } from "./resource";

export class ProductResource extends Resource {
  constructor(
    data: Product,
    protected request: Request,
    meta?: { links?: { [key: string]: Link }; [key: string]: any }
  ) {
    super(data, meta);
  }

  toJson() {
    const url = this.request.originalUrl.split("?")[0];
    const defaultLinks = {
      self: {
        href: url + "/" + this.data.id,
        method: "GET",
        type: "application/json",
      },
      update: {
        href: url + "/" + this.data.id,
        method: "PATCH",
        type: "application/json",
      },
      delete: {
        href: url + "/" + this.data.id,
        method: "DELETE",
      },
    };

    const result = super.toJson();

    return {
      ...result,
      _meta: {
        ...result._meta,
        _links: {
          ...result._meta._links,
          ...defaultLinks,
        },
      },
    };
  }
}

export class ProductResourceCollection extends ResourceCollection {
  constructor(
    protected data: Product[],
    protected request: Request,
    protected meta?: {
      paginationData?: { total: number; page: number; limit: number };
      links?: { [key: string]: Link };
      [key: string]: any;
    }
  ) {
    super(data, meta);
  }

  toJson() {
    const defaultLinks = {
      self: {
        href: this.request.originalUrl,
        method: "GET",
        type: "application/json",
      },
      ...(this.meta?.paginationData && {
        //conditionally for next
        ...(this.meta?.paginationData.page * this.meta?.paginationData.limit <
          this.meta?.paginationData.total && {
          next: {
            href:
              this.request?.originalUrl +
              `?page=${this.meta?.paginationData.page + 1}`,
            method: "GET",
          },
        }),
        //conditionally for prev
        ...(this.meta?.paginationData.page > 1 && {
          prev: {
            href:
              this.request?.originalUrl +
              `?page=${this.meta?.paginationData.page - 1}`,
            method: "GET",
          },
        }),
        last: {
          href:
            this.request?.originalUrl +
            `?page=${Math.ceil(
              this.meta?.paginationData.total / this.meta?.paginationData.limit
            )}`,
          method: "GET",
        },
      }),
    };

    const { _meta: defaultMeta } = super.toJson();
    const { paginationData, ...otherMeta } = this.meta || {};

    const meta = {
      ...defaultMeta,
      ...otherMeta,
    };

    return {
      data: this.data.map((product) => {
        const resource = new ProductResource(product, this.request);
        const { data, _meta } = resource.toJson();
        return {
          ...data,
          _meta,
        };
      }),
      _meta: {
        ...meta,
        _links: {
          ...defaultLinks,
          ...this.meta?.links,
        },
      },
    };
  }
}
