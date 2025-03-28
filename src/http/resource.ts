export class Resource<T = object> {
  constructor(protected data: T, protected meta?: any) {}

  toJson() {
    return {
      data: this.data,
      ...(this.meta ? { meta: this.meta } : {}),
    };
  }
}

export class ResourceCollection<T> extends Resource<T[]> {
  constructor(
    data: T[],
    meta?: {
      paginationData?: { total: number; page: number; limit: number };
      [key: string]: any;
    }
  ) {
    super(data, meta);
  }

  toJson() {
    const { paginationData, otherData } = this.meta || {};
    const meta = {
      ...otherData,
      current_page: paginationData.page,
      total: paginationData.total,
      per_page: paginationData.limit,
    };

    return {
      data: this.data,
      meta,
    };
  }
}
