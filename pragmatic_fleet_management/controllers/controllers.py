# -*- coding: utf-8 -*-
from odoo import http
import requests
from odoo.http import request
import json



class FleetWebsiteController(http.Controller):

    @http.route('/update-driver-location', type='http', auth='public',csrf=False, website=True)
    def update_drivers_live_location(self, **post):
        # if request.env.user._is_public():

            res_users = request.env['res.users'].sudo().search([('id', '=', request.env.user.id)])
            res_partner = request.env['res.partner'].sudo().search([('id', '=', res_users.partner_id.id)])
            print('^^^^^^^^^^^^^^^^^^^^^^ partner ^^^^^^^^^^^^^^^^^^^^^^', res_partner.name)
            print('^^^^^^^^^^^^^^^^^^^^^^ user ^^^^^^^^^^^^^^^^^^^^^^', res_users.name)
            print('^^^^^^^^^^^^^^^^^^^^^^ post ^^^^^^^^^^^^^^^^^^^^^^', post)
            if res_partner.is_driver:
                print("11111111111111111111111 is driver")

                routes = [[res_partner[0].partner_latitude,
                       res_partner[0].partner_longitude]]
                api_key = http.request.env['ir.config_parameter'].sudo().search([('key', '=', 'google.api_key_geocode')])

                if len(api_key) == 1:
                    maps_url = "//maps.google.com/maps/api/js?key=" + api_key.value + "&amp;libraries=places&amp;language=en-AU"

                if post.get('lat') and post.get('lng'):
                    routes = [[float(post.get('lat')), float(post.get('lng'))]]
                    res_partner.write({
                         'partner_latitude' : float(post.get('lat')),
                         'partner_longitude' : float(post.get('lng'))
                    })
                    

                print("((((((((((((((((((routs))))))))))))))))))", routes)
            else :
                print("2222222222222222222222222 not driver")
                 
                routes = [[0.0, 0.0]]
            return json.dumps({'routes': routes})
    

    @http.route('/view-location', type='http', auth='public', website=True)
    def view_live_location_user(self):
        print("___________-in map___--view---------------")
        res_users = request.env['res.users'].sudo().search([('id', '=', request.env.user.id)]) 
        res_partner = request.env['res.partner'].sudo().search([('id', '=', res_users.partner_id.id)])
        api_key = http.request.env['ir.config_parameter'].sudo().search([('key', '=', 'pragmatic_fleet_management.google_api_key')])
        print('PPPPPPPPPPPPPppppartnerrrrrrrrrrrrrrrrrr', res_partner.name)
        print('PPPPPPPPPPPPPppppartnerrrrrrrrrrrrrrrrrr is driver????', res_partner.is_driver)

        maps_url = ""
        if len(api_key) == 1:
            maps_url = "https://maps.google.com/maps/api/js?key=" + api_key.value + "&amp;libraries=places&amp;language=en-AU"

        if res_partner.is_driver:
            values = {
                'maps_script_url' : maps_url,
                'name' : res_partner.name,
                'partner_id': res_partner.id,
                'lat' : res_partner.partner_latitude,
                'lng' : res_partner.partner_longitude,
            }
            return request.render('pragmatic_fleet_management.map_view_template', {'maps_script_url': maps_url})

        else:
            return request.render('pragmatic_fleet_management.map_view_template',{'maps_script_url': maps_url})
            
    

