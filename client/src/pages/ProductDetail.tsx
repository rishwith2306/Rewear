import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share, MessageCircle, Shield, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, User } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!productId,
  });

  const { data: seller } = useQuery<User>({
    queryKey: ["/api/users", product?.sellerId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${product?.sellerId}`);
      if (!response.ok) throw new Error("Failed to fetch seller");
      return response.json();
    },
    enabled: !!product?.sellerId,
  });

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop"];

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img 
              src={images[selectedImageIndex]} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 ${
                  selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.title} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ${parseFloat(product.originalPrice).toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {discountPercentage}% off
                  </Badge>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Size: {product.size}</span>
              <span>•</span>
              <span>Condition: {product.condition.replace('_', ' ')}</span>
              {product.brand && (
                <>
                  <span>•</span>
                  <span>Brand: {product.brand}</span>
                </>
              )}
            </div>
          </div>

          {/* Seller Info */}
          {seller && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={seller.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {seller.firstName?.[0]}{seller.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {seller.firstName} {seller.lastName}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {parseFloat(seller.rating || "0").toFixed(1)} ({seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Usually responds within 2 hours</p>
                </div>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </Card>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Size</span>
                <span className="text-gray-900">{product.size}</span>
              </div>
              {product.color && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Color</span>
                  <span className="text-gray-900">{product.color}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Material</span>
                  <span className="text-gray-900">{product.material}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Condition</span>
                <span className="text-gray-900">{product.condition.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <Button className="w-full" size="lg">
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Make an Offer
            </Button>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Trust & Safety */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Buyer Protection</h4>
                  <p className="text-sm text-blue-700">
                    Your purchase is protected. If the item doesn't match the description, 
                    you can return it for a full refund.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Items */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for similar items */}
          <div className="text-center text-gray-500 col-span-full py-8">
            Related items would be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}
