import React from 'react';
import Banner from './Banner';
import ProductPreview from './ProductPreview';
import AdsCarousel from './AdsCarousel';
import TracPrices from './TracPrices';
import HowWorks from './HowWorks';
import Reviews from './Reviews';

const Home = () => {
    return (
        <div>
           <Banner></Banner> 
           <ProductPreview></ProductPreview>
           <AdsCarousel></AdsCarousel>
           <TracPrices></TracPrices>
           <HowWorks></HowWorks>
           <Reviews></Reviews>
        </div>
    );
};

export default Home;