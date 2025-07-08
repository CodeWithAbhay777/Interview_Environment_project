{/*import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        category.map((cat, index) => (
                            <CarouselItem className="md:basis-1/2 lg-basis-1/3">
                                <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="rounded-full">{cat}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel*/}

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Software Developer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 bg-violet-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Explore Popular Job Categories
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
          Quickly jump into interviews tailored to your preferred career path.
          Select a category below to get started!
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto relative">
        <Carousel className="w-full">
          <CarouselContent>
            {category.map((cat, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-2">
                <Button
                  onClick={() => searchJobHandler(cat)}
                  variant="outline"
                  className="rounded-full w-full py-3 text-sm md:text-base font-semibold hover:bg-violet-200 transition"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-violet-600 hover:text-violet-800" />
          <CarouselNext className="text-violet-600 hover:text-violet-800" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;