import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Place from './Place';
import Horario from './Horario';
import Reviews from './Reviews';
import Rating from './Rating';
import NearbyPlace from './NearbyPlace';
import GoogleLogin from './GoogleLogin'

class App extends Component {
  constructor(props){
    super(props);
    this.state={photo:'', showAllNearbyPlaces: false}
  }

  loginStatus = (loginGoogle) => {
    this.setState({logged:loginGoogle})
  };

  map=''

  componentDidMount(){
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google){
        this.google=window.google;
        clearInterval(googlePlaceAPILoad);
        console.log('Load Place API');
        const mapCenter = new this.google.maps.LatLng(4.624335,-74.064644);
        this.map = new this.google.maps.Map(document.getElementById('gmapContainer'), {
          center: mapCenter,
          zoom: 16
        });
        // var marcador = new this.google.maps.Marker({position:mapCenter, map:this.map})
        this.showMap(mapCenter);
      };
    },100);
  }

  showMap(mapCenter) {
    var map = new window.google.maps.Map(
        document.getElementById('map'), {zoom: 16, center: mapCenter});
    var marker = new window.google.maps.Marker({position: mapCenter, map: map});
  }

  manejoOnClick = (e) => {
    const request = {
      query: document.getElementById('origen').value ,
      fields: ['photos', 'formatted_address', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, this.findPlaceResult);
  }

  getNearbyPlacesOnClick = (e) => {
    let request = {
      location: this.state.placeLocation,
      radius: '10000',
    };

    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(request, this.callbackSearchNearby)
  }

  callbackSearchNearby = (results, status) => {
    if (status == this.google.maps.places.PlacesServiceStatus.OK) {
      console.log("callback received " + results.length + " results");
      window.lugaresCercanos = results
      if (results.length) {
        let nearbyPlaces = results.map((place, index) =>
          <NearbyPlace key={index} placeData={place}
            chooseDestination={this.changeDestination}></NearbyPlace>)

        this.setState({
          nearbyPlaces: nearbyPlaces
        })
      }
    } else console.log("callback.status=" + status);
  }

  findPlaceResult = (results, status) => {
    var placesTemp=[]
    var placeId = ''
    if (status ===  'OK') {
      results.map((place) => {
        var placePhotos=['']
        const placeTemp = {id:place.place_id, name:place.name,
          address:place.formatted_address,photos:placePhotos}
          placeId = place.place_id;
        placesTemp.push(<Place placeData={placeTemp}/>);
      })
    }
    if (placesTemp.length>0)
      this.findPlaceDetail(placeId);
    else{
      const placeTemp = {id:'N/A', name:<div className='mt-5'><strong className='text-center'>
          No hay resultados</strong></div>,
        address:'',photos:['']}
      placesTemp.push(<Place placeData={placeTemp}/>);
      this.setState({places:placesTemp, showAllNearbyPlaces: false})
    }
  }

  findPlaceDetail = (placeIdFound) => {
    var request = {
      placeId: placeIdFound,
      fields: ['address_component', 'adr_address', 'alt_id', 'formatted_address','opening_hours',
       'icon', 'id', 'name', 'permanently_closed', 'photo', 'place_id', 'plus_code', 'scope', 
       'type', 'url', 'utc_offset', 'vicinity','geometry','rating', 'reviews']
    };
    this.service.getDetails(request, this.foundPlaceDatail);
  }

  foundPlaceDatail = (place, status) => {
    if (status === 'OK'){
      var placePhotos=['']
      if (place.photos){
        place.photos.map((placePhoto, index) => {
          placePhotos[index]=placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
         // if (index === 2) return;
        })
      }
      const placeTemp = {id:place.place_id, name:place.name,
        address:place.formatted_address,photos:placePhotos}
      const placesTemp = <Place placeData={placeTemp}/>;
      const placeHorarios = <Horario horarios={place.opening_hours}/>
      var rating = ''
      if (place.rating) {
        rating = <Rating placeRating={place.rating} />
      }
      else {
        rating = <div key={1} className='row mt-2 mb-1 pl-3' >
        </div>;
      }

      this.setState({
        places: placesTemp,
        placeHorarios: placeHorarios,
        placeReviews: <Reviews placeReviews={place.reviews} />,
        placeRating: rating,
        nearbyPlaces: []
        
        
      })
      this.showMap(place.geometry.location);
   } 
  }

  render() {
    if (this.state.logged)
      return (
        <div className="App" > 
          <div className='container border rounded p-3 mt-4' style={{width:'50%'}}>
            <div className='row'>
              <div className='col-4'></div>
              <div className='col-4 text-center'>
                <label><strong>Indica el lugar</strong></label>
              </div>
              <div className='col-4'></div>
            </div>
            <div className='row'>
              <div className='col-4'></div>
              <div className='col-4 py-2'><input id='origen' type='text'/></div>
              <div className='col-4'></div>
            </div>
            <div className='row'>
              <div className='col-4'></div>
              <div className='col-4 text-center'>
                <div className='btn btn-primary text-center' onClick={this.manejoOnClick}>Buscar Lugar</div>
              </div>
              <div className='col-4'></div>
            </div>
            {this.state.places}
            {this.state.placeHorarios}
            <div className="container">
                {this.state.placeRating}
              </div>
            {this.state.placeReviews}
            {this.state.places &&
                <div className='row'>
                  <div className="col-12">
                    <button className="btn btn-info text-center" onClick={this.getNearbyPlacesOnClick}>Buscar lugares cercanos</button>
                  </div>
                </div>
              }
              <div className="row row-cols-1 row-cols-md-1 mt-2">
                {this.state.showAllNearbyPlaces ?
                  this.state.nearbyPlaces :
                  this.state.nearbyPlaces?.slice(0, 9)
                }
              </div>
              {this.state.nearbyPlaces &&
                <div className="container">
                  <div className="mb-3">
                    <a href='#' onClick={(e) => {
                      e.preventDefault();
                      this.setState({ showAllNearbyPlaces: true });
                    }}>
                      Mostrar más lugares cercanos
                </a>
                  </div>
                  <div className="row">
                    <div className="col">
                      <input id='origen' className="form-control" type='text' placeholder="Origen" />
                    </div>
                    <div className="col">
                      <select id="mode" className="form-control">
                        <option value="VEHICLE">Vehículo</option>
                        <option value="TRANSPORT">Transporte Público</option>
                        <option value="BICYCLING">Bicicleta</option>
                        <option value="WALKING">Caminando</option>
                      </select>
                    </div>
                    <div className="col">
                      <button className="btn btn-info" onClick={this.calcRoute}>Ir al destino indicado</button>
                    </div>
                  </div>
                </div>}

            <div id="map" className='mt-2' ></div>
          </div>
          <GoogleLogin loginStatus={this.loginStatus} logged={true}/>
        </div>
      );
    else
      return (<GoogleLogin loginStatus={this.loginStatus} logged={false}/>);
  }
}

export default App;
