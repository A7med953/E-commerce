import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly platformId = inject(PLATFORM_ID);

  constructor(private httpClient:HttpClient) { }
  register(data:any):Observable<any>{
    return this.httpClient.post(environments.baseUrl+'auth/signup',data)
  }
 login(data: any): Observable<any> {
  return this.httpClient.post(
    environments.baseUrl + 'auth/signin',
    data
  );
}
DecodeToken(){
  try{
const decodeed =jwtDecode(localStorage.getItem('authToken')!);
  console.log(decodeed )
  }
  catch{
this.logout
  }
  
}
// The logged-in user's id, read from the JWT (needed for the orders API)
getUserId(): string | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    return (jwtDecode(token) as { id?: string }).id ?? null;
  } catch {
    return null;
  }
}
saveToken(token: string): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('authToken', token);
  }
}

getToken(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem('authToken');
  }
  return null;
}

isAuthenticated(): boolean {
  return !!this.getToken();
}

logout(): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('authToken');
  }
}
}
