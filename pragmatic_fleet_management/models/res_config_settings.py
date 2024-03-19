# -*- coding: utf-8 -*-
# License AGPL-3

from odoo import api, fields, models
import logging
import requests
import base64
import json
_logger = logging.getLogger(__name__)




class Base(models.TransientModel):
    _inherit = 'res.config.settings'


    google_maps_view_api_key = fields.Char(default=lambda self:self.env['ir.config_parameter'].sudo().get_param('pragmatic_fleet_management.google_api_key'))


    @api.onchange('google_maps_view_api_key')
    def set_values(self):
        super(Base, self).set_values()
        _logger.info("...................Api Seleced is : %s",self.google_maps_view_api_key )
        self.env['ir.config_parameter'].sudo().set_param(
            'pragmatic_fleet_management.google_api_key', self.google_maps_view_api_key)
        
    def get_map_api_key(self):
        map_api_key = self.env['ir.config_parameter'].sudo().get_param(
            'pragmatic_fleet_management.google_api_key')
        return map_api_key