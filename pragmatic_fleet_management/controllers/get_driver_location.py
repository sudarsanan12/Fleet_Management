from odoo import http
import requests
from odoo.http import request
import json

class FleetDashboardController(http.Controller):


    @http.route('/get-driver-location', type='json', auth='public',methods=['POST', 'GET'],csrf=False)
    def get_driver_location(self, **post):
        print("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", post)
        attendance_rec = request.env['hr.attendance'].search([])
        print("##########################################33", attendance_rec)
        for rec in attendance_rec:
            print("++++++++++++++++++= Employee name ++++++++++++++",rec.employee_id.name)
            print("++++++++++++++++++= Attendance login time ++++++++++++++",rec.check_in)
        if post.get('param'):
            driver = request.env['res.partner'].search([('name', 'like', post.get('param'))], limit=1)
            # each_driver = request.env['res.partner'].search([('name', '=', post.get('param'))], limit=1)
            base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')
            image_url_1920 = base_url + '/web/image?'+'model=res.partner&id=' + str(driver.id)+ '&field=image_1920'
            data =[{
                'image' : image_url_1920,
                'id' : driver.id,
                'name' : driver.name,
                'vehicle_number' : driver.vehicle_number,
                'partner_lat' : driver.partner_latitude,
                'partner_lng' : driver.partner_longitude,
                'vehicle_type' : driver.vehicle_type
            }]
            return data
        else :
            all_members = request.env['res.partner'].search([('is_driver', '=', True)])
            print("333333333333333333333333333333333333333333333333", all_members)
            data = []
            for member in all_members:
                base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')
                image_url_1920 = base_url + '/web/image?'+'model=res.partner&id=' + str(member.id)+ '&field=image_1920'

                data.append ({
                    'image' : image_url_1920,
                    'id' : member.id,
                    'name' : member.name,
                    'vehicle_number' : member.vehicle_number,
                    'partner_lat' : member.partner_latitude,
                    'partner_lng' : member.partner_longitude,
                    'vehicle_type' : member.vehicle_type
                })
                print("444444444444444444444444444444444444444444", data)
            return data