import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah from Algiers',
    role: 'Regular Customer',
    content: 'Amazing quality and fast delivery! The pieces exceeded my expectations. Will definitely shop again!',
    rating: 4,
    image: '👩',
  },
  {
    name: 'Amina from Oran',
    role: 'Fashion Lover',
    content: 'Great selection and excellent customer service. Every piece truly is a masterpiece!',
    rating: 5,
    image: '👩‍🦰',
  },
  {
    name: 'Lina from Constantine',
    role: 'Style Blogger',
    content: 'I love how easy it is to find trendy pieces. User-friendly website and reasonable prices.',
    rating: 5,
    image: '👩',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-600 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-neutral-500">
            Real testimonials from our happy customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 border border-neutral-200 rounded-2xl bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm sm:text-base text-neutral-500 leading-relaxed mb-6">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-50 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-neutral-600">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
