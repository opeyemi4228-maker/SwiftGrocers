import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    finalPrice: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Groceries', 'Beverages', 'Fruits', 'Household', 'Bakery', 'Frozen', 'Personal', 'Pets', 'Baby', 'Health', 'Beauty', 'Electronics', 'Fashion', 'Office']
    },
    image: {
      type: String,
      required: true
    },
    images: [String],
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Calculate final price
productSchema.pre('save', function(next) {
  this.finalPrice = this.price - (this.price * this.discount / 100);
  next();
});

export default mongoose.model('Product', productSchema);