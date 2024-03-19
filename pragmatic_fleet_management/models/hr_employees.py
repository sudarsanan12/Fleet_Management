# -*- coding: utf-8 -*-

from odoo import models, fields, api
import base64


class Employee(models.Model):
    _inherit = 'hr.employee'

    is_admin = fields.Boolean(string="Admin",default=False)
    is_driver = fields.Boolean(string="Driver",default=False)
    vehicle_number = fields.Char()
    user_created = fields.Boolean(default=False)
    vehicle_type = fields.Selection([('car', 'Car'),('bike', 'Bike'), ('picup', 'Picup'), ('bus', 'Bus'),('truck', 'Truck')])


    
    def create_users_employee(self):
        if self.is_driver:
            # driver_login_group = self.env.ref('pragmatic_fleet_management.group_driver')
            x_group_portal_user = self.env.ref('base.group_portal')
            user = self.env['res.users'].create({
            'name': self.name,
            'login': self.work_email,  
            'email': self.work_email,
            'vehicle_number' : self.vehicle_number,
            'vehicle_type' : self.vehicle_type,
            'groups_id': [(4, x_group_portal_user.id)]
            
            })
            self.user_created = True
            user.partner_id.is_driver = True
        

        self.user_id = user.id
        return user
    
    

class Customer(models.Model):
    _inherit = 'res.partner'


    is_admin = fields.Boolean(string="Admin",default=False)
    is_driver = fields.Boolean(string="Driver",default=False)
    vehicle_number = fields.Char()
    vehicle_type = fields.Selection([('car', 'Car'),('bike', 'Bike'), ('picup', 'Picup'), ('bus', 'Bus'),('truck', 'Truck')])


    def get_all_drivers(self):
        all_members = self.search([('is_driver', '=', True)])
        print("===================== callinggggggggggggggggggggggggggggg")
        attendance_rec = self.env['hr.attendance'].search([])
        for rec in attendance_rec:
            print("++++++++++++++++++= Employee name ++++++++++++++",rec.employee_id.name)
            print("++++++++++++++++++= Attendance login time ++++++++++++++",rec.check_in)
        data = []
        for member in all_members:
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')
            image_url_1920 = base_url + '/web/image?'+'model=res.partner&id=' + str(member.id)+ '&field=image_1920'

            data.append({
                'image' : image_url_1920,
                'id' : member.id,
                'name' : member.name,
                'vehicle_number' : member.vehicle_number,
                'partner_lat' : member.partner_latitude,
                'partner_lng' : member.partner_longitude,
                'vehicle_type' : member.vehicle_type
            })
        return data
    

    def get_each_drivers(self, name):
        driver = self.search([('name', 'like', name)], limit=1)
        base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')
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



       


# class ChangePasswordWizard(models.TransientModel):
#     _inherit = "change.password.wizard"

#     def _default_user_ids(self):
#         user_ids = self._context.get('active_model') == 'res.users' and self._context.get('active_ids') or []
#         if self._context.get('active_model') == 'res.partner':
#             id = self._context.get('active_id')
#             user = self.env['res.users'].search([('partner_id', '=', id)])
#             user_ids = user.id
#         return [
#             (0, 0, {'user_id': user.id, 'user_login': user.login})
#             for user in self.env['res.users'].browse(user_ids)
#         ]

#     user_ids = fields.One2many('change.password.user', 'wizard_id', string='Users', default=_default_user_ids)
