'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/custom-button';
import { NumberInput } from '@/components/ui/number-input';
import { useProductForm, ProductFormData } from '@/hooks/useProductForm';
import { useProduct } from '@/hooks/useProducts';
import { Upload, X, Plus } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/product-form.css';
import { Product } from '@/lib/types/product';
import Link from 'next/link';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Brown', value: 'brown', hex: '#8B4513' },
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
  { name: 'Dark Blue', value: 'dark-blue', hex: '#010321' },
  { name: 'Gray', value: 'gray', hex: '#808080' },
  { name: 'Yellow', value: 'yellow', hex: '#FFFF00' },
];
const CATEGORIES = ['Chemises', 'Jupes', 'Hijeb', 'Ensemble', 'Jackets', 'Robes'];
const STATUS_OPTIONS = ['Available', 'Unavailable', 'Draft'];
const DISCOUNT_TYPES = ['Back to school', 'Seasonal', 'Clearance', 'Flash sale', 'New customer'];

interface ProductFormProps {
  productId?: string;
  initialData?: Partial<ProductFormData>;
  isEdit?: boolean;
}

export default function ProductForm({ productId, initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    formData,
    updateField,
    updateImages,
    removeImage,
    submitForm,
    isLoading,
    errors,
    initializeForm,
  } = useProductForm();

  // If productId is provided and no initialData, fetch product to initialize the form
  const { product: fetchedProduct, isLoading: isProductLoading } = useProduct(productId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Initialize form with product data if editing
  useEffect(() => {
    if (!isEdit) return;

    // priority: explicit initialData prop, otherwise fetched product
    const source = initialData ? initialData : (fetchedProduct as Partial<Product> | undefined);
    if (source) {
      const formDataToSet = {
        name: (source as any).name || '',
        description: (source as any).description || '',
        modelDetails: (source as any).modelDetails || '',
        availableSizes: Array.isArray((source as any).availableSizes) ? (source as any).availableSizes.join(', ') : ((source as any).availableSizes || ''),
        isAvailable: (source as any).isAvailable ?? true,
        price: (source as any).price || 0,
        originalPrice: (source as any).originalPrice,
        image: (source as any).image || '',
        color: (source as any).color || '',
        category: (source as any).category || '',
        stock: (source as any).stock || 0,
        discount: (source as any).discount || 0,
        discountType: (source as any).discountType || '',
        images: [],
        imageUrls: Array.isArray((source as any).images)
          ? (source as any).images.map((img: any) => (typeof img === 'string' ? img : img.url))
          : ((source as any).image ? [(source as any).image] : []),
      };
      initializeForm(formDataToSet);
      // Set image preview URLs from existing images
      const existingUrls = formDataToSet.imageUrls || [];
      if (existingUrls.length > 0) setImagePreviewUrls(existingUrls);
    }
  }, [isEdit, initialData, fetchedProduct, initializeForm]);

  // Create preview URLs for uploaded images
  useEffect(() => {
    const uploadedUrls = formData.images.map((file) => URL.createObjectURL(file));
    const existingUrls = formData.imageUrls || [];
    setImagePreviewUrls([...existingUrls, ...uploadedUrls]);

    // Cleanup function to revoke URLs
    return () => {
      uploadedUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.images, formData.imageUrls]);

  const handleImageUpload = (files: FileList | null, index?: number) => {
    if (!files || files.length === 0) return;

    if (index !== undefined) {
      // Update specific thumbnail
      const file = files[0];
      const newImages = [...formData.images];
      newImages[index] = file;
      updateField('images', newImages);
    } else {
      // Main image upload
      updateImages(Array.from(files));
    }
  };

  const handleSaveDraft = async () => {
    const result = await submitForm(true, isEdit, productId);
    if (result.success) {
      showToast('Draft saved successfully!', 'success');
    } else {
      showToast(`Error: ${result.error}`, 'error');
    }
  };

  const handleSubmit = async () => {
    const result = await submitForm(false, isEdit, productId);
    if (result.success) {
      showToast(isEdit ? 'Product updated successfully!' : 'Product added successfully!', 'success');
      router.push('/admin/products');
    } else {
      showToast(`Error: ${result.error}`, 'error');
    }
  };

  const allImageUrls = [...(formData.imageUrls || []), ...imagePreviewUrls.filter(url => !formData.imageUrls?.includes(url))];

  return (
    <div className="page-container product-form-container">
      {/* Breadcrumb */}
      <div className="product-form-breadcrumb">
        <Link href="/admin" className="text-gray-600 hover:underline">Dashboard</Link>
        <span className="product-form-breadcrumb-separator">/</span>
        <Link href="/admin/products" className="text-gray-600 ">Products</Link>
        <span className="product-form-breadcrumb-separator">/</span>
        <span className="product-form-breadcrumb-active">
          {isEdit ? 'Edit product' : 'New product'}
        </span>
      </div>

      {/* Page Header */}
      <div className="page-header mb-6">
        <h2 className="page-title">
          {isEdit ? 'Edit product' : 'Add new product to the store'}
        </h2>
      </div>

      {/* Form */}
      <div className="product-form-grid">
        {/* Left Column */}
        <div className="product-form-column">
          {/* Product Images Section */}
          <div className="product-images-section">
            <h3 className="product-images-title">Product Images</h3>

            {/* Main Image Upload */}
            <div
              className="product-image-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              {allImageUrls.length > 0 ? (
                <div className="product-image-preview-container">
                  <img
                    src={allImageUrls[0]}
                    alt="Main product"
                    className="product-image-preview"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (formData.imageUrls && formData.imageUrls.length > 0) {
                        const newUrls = formData.imageUrls.slice(1);
                        updateField('imageUrls', newUrls);
                      } else {
                        removeImage(0);
                      }
                    }}
                    className="product-image-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="product-image-upload-icon" />
                  <p className="product-image-upload-text">
                    <span className="product-image-upload-link">↑ Drop your files, or Browse</span>
                  </p>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="product-thumbnail-grid">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="product-thumbnail-item"
                  onClick={() => thumbnailInputRefs.current[index]?.click()}
                >
                  <input
                    ref={(el) => { (thumbnailInputRefs.current[index] = el) }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files, index + 1)}
                  />
                  {allImageUrls[index + 1] ? (
                    <div className="product-thumbnail-preview">
                      <img
                        src={allImageUrls[index + 1]}
                        alt={`Thumbnail ${index + 1}`}
                        className="product-thumbnail-image"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (formData.imageUrls && formData.imageUrls.length > index + 1) {
                            const newUrls = formData.imageUrls.filter((_, i) => i !== index + 1);
                            updateField('imageUrls', newUrls);
                          } else {
                            removeImage(index + 1);
                          }
                        }}
                        className="product-thumbnail-remove"
                      >
                        <X className="product-thumbnail-icon" />
                      </button>
                    </div>
                  ) : (
                    <Plus className="product-thumbnail-add-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Model Details Section */}
          <div className="model-details-section">
            <h3 className="model-details-title">Model details</h3>
            <textarea
              value={formData.modelDetails}
              onChange={(e) => updateField('modelDetails', e.target.value)}
              placeholder="Enter model details (e.g., Height, Waist, Thighs, etc.)"
              className="model-details-textarea"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="product-form-column">
          {/* Product Information */}
          <div className="product-info-section">
            <h3 className="product-info-title">Product Information</h3>

            {/* Product Name */}
            <div>
              <Input
                label="Product name"
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                placeholder="denim baggy jeans"
                error={!!errors.name}
                caption={errors.name}
              />
            </div>

            {/* Description */}
            <div>
              <label className="product-form-label">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Enter product description"
                className="product-form-textarea"
              />
              {errors.description && (
                <p className="product-form-error">{errors.description}</p>
              )}
            </div>

            {/* Available Sizes */}
            <div>
              <Input
                label="Available Sizes"
                value={formData.availableSizes}
                onChange={(value) => updateField('availableSizes', value)}
                placeholder="Enter sizes separated by comma (e.g., S, M, L, XL)"
              />
            </div>

            {/* Color */}
            <div>
              <label className="product-form-label">
                Available Colors
              </label>
              <div className="product-color-selector">
                {COLORS.map((color) => {
                  const isSelected = formData.availableColors?.some(c => c.name.toLowerCase() === color.value.toLowerCase());
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        const currentColors = [...(formData.availableColors || [])];
                        const index = currentColors.findIndex(c => c.name.toLowerCase() === color.value.toLowerCase());

                        if (index >= 0) {
                          // Remove if already selected
                          currentColors.splice(index, 1);
                        } else {
                          // Add if not selected
                          currentColors.push({ name: color.name, hex: color.hex });
                        }

                        updateField('availableColors', currentColors);
                        // Also set the first selected as the "main" color for backward compatibility
                        if (currentColors.length > 0 && !formData.color) {
                          updateField('color', currentColors[0].name.toLowerCase());
                        }
                      }}
                      className={`product-color-swatch ${isSelected
                        ? 'product-color-swatch-selected'
                        : 'product-color-swatch-default'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Click to select/deselect colors that will be available to customers.
              </p>
            </div>


            {/* Category */}
            <div>
              <Input
                label="Category"
                variant="list"
                value={formData.category}
                onChange={(value) => updateField('category', value)}
                options={CATEGORIES}
                placeholder="Select category"
                error={!!errors.category}
                caption={errors.category}
              />
            </div>


            {/* Price */}
            <div>
              <label className="product-form-label">
                Price
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.price}
                  onChange={(value) => updateField('price', value)}
                  min={0}
                  max={999999}
                  allowDecimals={true}
                  className="flex-1"
                  error={!!errors.price}
                />
                <span className="product-input-currency">DZD</span>
              </div>
              {errors.price && (
                <p className="product-form-error">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="product-form-label">
                Stock
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.stock}
                  onChange={(value) => updateField('stock', value)}
                  min={0}
                  max={999999}
                  allowDecimals={false}
                  className="flex-1"
                  error={!!errors.stock}
                />
                <span className="product-input-currency">piece</span>
              </div>
              {errors.stock && (
                <p className="product-form-error">{errors.stock}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="product-form-label">
                Discount
              </label>
              <div className="product-input-group">
                <NumberInput
                  value={formData.discount}
                  onChange={(value) => updateField('discount', value)}
                  min={0}
                  max={100}
                  allowDecimals={true}
                  className="flex-1"
                  error={!!errors.discount}
                />
                <span className="product-input-currency">%</span>
              </div>
              {errors.discount && (
                <p className="product-form-error">{errors.discount}</p>
              )}
            </div>

            {/* Type of Discount */}
            <div>
              <Input
                label="Type of discount"
                variant="list"
                value={formData.discountType}
                onChange={(value) => updateField('discountType', value)}
                options={DISCOUNT_TYPES}
                placeholder="Select discount type"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-form-actions">
        <CustomButton
          variant="outlined"
          text="Save draft"
          onClick={handleSaveDraft}
          disabled={isLoading}
          className="product-form-button"
        />
        <CustomButton
          text={isEdit ? 'Update product' : 'Add product'}
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          className="product-form-button product-form-button-primary"
        />
      </div>
    </div>
  );
}

