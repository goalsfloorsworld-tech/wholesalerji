import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WallPanelProduct } from '@/sanity/schemas/product';

interface ProductGridProps {
  products: WallPanelProduct[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({
  products,
  title = 'Wholesale Wall Panel Catalog',
  subtitle = 'Factory direct dispatch. Tiered pricing available for commercial projects and distribution.',
}: ProductGridProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs md:text-sm text-stone-400 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const primaryImg =
            product.images.find((img) => img.isPrimary)?.cloudinaryPublicId ||
            product.images[0]?.cloudinaryPublicId ||
            '/assets/panels/wpc_louver_texture.jpg';

          const lowestPrice = Math.min(...product.bulkPricing.map((p) => p.pricePerUnit));
          const highestPrice = Math.max(...product.bulkPricing.map((p) => p.pricePerUnit));

          return (
            <div
              key={product._id}
              className="group flex flex-col bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 shadow-lg"
            >
              {/* Product Thumbnail with Badges */}
              <div className="relative aspect-[4/3] w-full bg-stone-950 overflow-hidden">
                <Image
                  src={primaryImg}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-stone-950/80 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-white/10">
                    {product.material}
                  </span>
                  {product.isWaterproof && (
                    <span className="bg-sky-500/80 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                      Waterproof
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-stone-950/85 backdrop-blur-md text-stone-300 font-medium text-[10px] px-2 py-0.5 rounded border border-white/10">
                  MOQ: {product.moq} {product.priceUnit.replace('per ', '')}
                </div>
              </div>

              {/* Product Meta & Pricing */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5 font-medium">
                  <span>{product.sku}</span>
                  <span>{product.thickness}mm • {product.finish}</span>
                </div>

                <Link
                  href={`/products/${product.slug}`}
                  className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1"
                >
                  {product.name}
                </Link>

                <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed flex-1">
                  {product.shortDescription}
                </p>

                {/* Bulk Price Tier Strip */}
                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">
                      Wholesale Tier Rate
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-amber-400">
                        ₹{lowestPrice} - ₹{highestPrice}
                      </span>
                      <span className="text-[11px] text-stone-400 font-normal">
                        /{product.priceUnit.replace('per ', '')}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-white transition-colors border border-stone-700"
                  >
                    View Specs
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
