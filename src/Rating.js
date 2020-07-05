import React, { Component } from 'react'
import '../node_modules/font-awesome/css/font-awesome.css'
import StarRatings from '../node_modules/react-star-ratings'

export default class Rating extends Component {
 

  render() {
    return (      
      <div className='row mt-2 mb-1' >
        <div className='col-3'><strong>Rating: </strong></div>
        <div className='col-2'><strong>{this.props.placeRating}</strong></div>
        <div className='col-6'>
          <StarRatings rating={this.props.placeRating} starRatedColor="red" starDimension="30px" numberOfStars={5} name='rating' />
        </div>
      </div>      
    )
  }
}
