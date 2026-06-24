# Softwear MongoDB Compass Aggregation Pipelines

Use these in MongoDB Compass by opening the target collection, selecting **Aggregations**, and pasting the pipeline array.

## 1. Total Revenue And Orders

Collection: `orders`

```js
[
  {
    $match: {
      orderStatus: { $ne: "cancelled" },
      "paymentInfo.status": { $in: ["paid", "pending"] }
    }
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
      totalOrders: { $sum: 1 },
      averageOrderValue: { $avg: "$totalAmount" }
    }
  },
  {
    $project: {
      _id: 0,
      totalRevenue: 1,
      totalOrders: 1,
      averageOrderValue: { $round: ["$averageOrderValue", 2] }
    }
  }
]
```

## 2. Daily Revenue

Collection: `orders`

```js
[
  { $match: { orderStatus: { $ne: "cancelled" } } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      revenue: { $sum: "$totalAmount" },
      orders: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]
```

## 3. Orders By Status

Collection: `orders`

```js
[
  {
    $group: {
      _id: "$orderStatus",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]
```

## 4. Top Selling Products

Collection: `products`

```js
[
  { $sort: { sold: -1 } },
  { $limit: 5 },
  {
    $project: {
      name: 1,
      brand: 1,
      category: 1,
      sold: 1,
      stock: 1
    }
  }
]
```

## 5. Low Stock Products

Collection: `products`

```js
[
  { $match: { stock: { $lt: 10 } } },
  { $sort: { stock: 1 } },
  {
    $project: {
      name: 1,
      brand: 1,
      category: 1,
      stock: 1,
      price: 1,
      discountPrice: 1
    }
  }
]
```

## 6. Monthly New Users

Collection: `users`

```js
[
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      users: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]
```

## 7. Revenue By Payment Method

Collection: `orders`

```js
[
  { $match: { orderStatus: { $ne: "cancelled" } } },
  {
    $group: {
      _id: "$paymentInfo.method",
      revenue: { $sum: "$totalAmount" },
      orders: { $sum: 1 }
    }
  },
  { $sort: { revenue: -1 } }
]
```

## 8. Cancelled Orders With Reasons

Collection: `orders`

```js
[
  { $match: { orderStatus: "cancelled" } },
  {
    $project: {
      userId: 1,
      totalAmount: 1,
      reason: "$cancellation.reason",
      cancelledBy: "$cancellation.cancelledBy",
      cancelledAt: "$cancellation.cancelledAt",
      createdAt: 1
    }
  },
  { $sort: { "cancellation.cancelledAt": -1 } }
]
```

## 9. Category Revenue From Order Items

Collection: `orders`

```js
[
  { $match: { orderStatus: { $ne: "cancelled" } } },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $group: {
      _id: "$product.category",
      revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      unitsSold: { $sum: "$items.quantity" }
    }
  },
  { $sort: { revenue: -1 } }
]
```

## 10. Recent Orders With Customer Info

Collection: `orders`

```js
[
  { $sort: { createdAt: -1 } },
  { $limit: 20 },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      totalAmount: 1,
      orderStatus: 1,
      paymentMethod: "$paymentInfo.method",
      paymentStatus: "$paymentInfo.status",
      customerName: "$user.name",
      customerEmail: "$user.email",
      createdAt: 1
    }
  }
]
```
