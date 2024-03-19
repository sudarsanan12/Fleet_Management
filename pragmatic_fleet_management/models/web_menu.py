from odoo import api, fields, models


class WebsiteMenu(models.Model):
   _inherit = 'website.menu'


   def _compute_visible(self):
       """Compute menu invisible"""
       super()._compute_visible()
       for menu in self:
           if not menu.is_visible:
               return
           print("mmmmmmmmmmmmmmmmmeeeeeeeeeeeeeeeeeee", menu.name)
           print("uuuuuuuuuuusssssssseeeeeeeeeeerrrrrrr", self.env.user.name)
           print(self.env.user.user_has_groups('pragmatic_fleet_management.group_driver'))
           if menu.name == 'View Map' and not self.env.user.user_has_groups(
                   'pragmatic_fleet_management.group_driver'):
               menu.is_visible = False