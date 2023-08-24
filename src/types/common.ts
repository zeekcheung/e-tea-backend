/** 用户角色 */
export enum Role {
  /** 顾客角色 */
  Customer = 0,
  /** 商家角色 */
  Shopkeeper,
  /** 管理员角色 */
  Admin,
}

/** 用户性别 */
export enum Sex {
  /** 未知 */
  Unknown = 0,
  /** 男性 */
  Male,
  /** 女性 */
  Female,
}

/** 商品售卖状态 */
export enum ProductStatus {
  /** 审核中 */
  UnderReview = 0,
  /** 售卖中 */
  InStock,
  /** 已售罄 */
  SoldOut,
  /** 已下架 */
  OffShelf,
}

/** 订单状态 */
export enum OrderStatus {
  /** 待支付 */
  PendingPayment = 0,
  /** 待发货 */
  PendingDelivery,
  /** 待收货 */
  PendingReceipt,
  /** 待评价 */
  PendingEvaluation,
  /** 已完成 */
  Finished,
  /** 已取消 */
  Canceled,
}

/** 支付方式 */
export enum PaymentMethod {
  /** 微信 */
  Wechat = 0,
  /** 支付宝 */
  Alipay,
}

/** 就餐方式 */
export enum EatingMethod {
  /** 自取 */
  TakeOut = 0,
  /** 外卖 */
  Delivery,
}
