import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    default: null,
  },
  brand: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  material: {
    type: String,
    default: null,
  },
  images: [{
    type: String,
    required: true,
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'deleted'],
    default: 'available',
  },
  location: {
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  shipping: {
    available: { type: Boolean, default: true },
    cost: { type: Number, default: 0 },
    methods: [String],
  },
  views: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Number,
    default: 0,
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ seller: 1 });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
