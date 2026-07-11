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

export interface UserData {
  _id: string;       
  userId: string;    
  name: string;
  email: string;
  image: string;
  district: string;
  upazila: string;
  role: 'citizen' | 'officer' | 'admin'; 
  status: 'active'| 'blocked'; 
}