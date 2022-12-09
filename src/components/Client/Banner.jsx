import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import frame7 from '../../image/Frame 7.jpg'
import frame8 from '../../image/Frame 8.jpg'
import frame9 from '../../image/Frame 9.jpg'
export const Banner = () => {
  return (
        <Carousel>
        <Carousel.Item interval={1000}>
            <img
            className="d-block w-100"
            src={frame7}
            alt="First slide"
            />
            <Carousel.Caption>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={500}>
            <img
            className="d-block w-100"
            src={frame8}
            alt="Second slide"
            />
            <Carousel.Caption>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src={frame9}
            alt="Third slide"
            />
            <Carousel.Caption>
            </Carousel.Caption>
        </Carousel.Item>
        </Carousel>
  )
}
