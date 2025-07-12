import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: number) => void;
  isFavorited?: boolean;
}

export default function ProductCard({ product, onToggleFavorite, isFavorited }: ProductCardProps) {
  const imageUrl = product.imageUrls?.[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop";

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-1 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">
          Size {product.size} • {product.condition.replace('_', ' ')}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
              <span className="text-sm text-gray-500 line-through">
                ${parseFloat(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className="h-8 w-8"
            >
              <Heart 
                className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
