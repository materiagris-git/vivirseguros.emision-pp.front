import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Globales } from 'src/interfaces/globales';


@Injectable()
export class AuthGuardPPCalendarioPagos implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {

            if(Globales.permisos.length>0){
                var index = Globales.permisos.indexOf(Globales.permisos.find(x => x.Pantallas == 'PPCalendarioPagosIndex'));
          
                if(index>-1){
                    
                    return true;
                }
                else{
                    
                    
                    return false;
                }
                
            }
            else{

                return false;
            }
        }

        else{
            this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
            return false;
        }
    }
}