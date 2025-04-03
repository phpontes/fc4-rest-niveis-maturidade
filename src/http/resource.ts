export interface IResource {
  toJson(): any;
}

export type Link = {
  href: string;
  method: string;
  type?: string;
};

export class Resource implements IResource {
  constructor(
    protected data: any,
    protected meta?: { links?: { [key: string]: Link };  [key: string]: any; }
  ) {}

  toJson() {
    const { links, ...otherMeta } = this.meta || {};

    return {
      data: this.data,
      _meta: {
        ...otherMeta,
        ...(links && { _links: links }),
      },
    };
  }
}

export class ResourceCollection implements IResource {
  constructor(
    protected data: any[],
    protected meta?: {
      paginationData?: { total: number; page: number; limit: number };
      links?: { [key: string]: Link };
      [key: string]: any;
    }
  ) {}

  toJson() {
    const { paginationData, links, ...otherData } = this.meta || {};

    const meta = {
      ...otherData,
      //@ts-expect-error
      current_page: paginationData.page,
      //@ts-expect-error
      total: paginationData.total,
      //@ts-expect-error
      per_page: paginationData.limit,
    };

    return {
      data: this.data,
      _meta: {
        ...meta,
        ...(links && { _links: links }),
      },
    };
  }
}