export interface District { 
  id: string; 
  division_id: string; 
  name: string; 
  bn_name: string; 
  lat: string; 
  lon: string; 
  url: string; 
}



export interface Upazila {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
  url: string;
}