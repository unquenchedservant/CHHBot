const { isDev } = require('./environment');

const announcementsIDDev = '471397293229342781';
const announcementsIDProd = '613469111682334762';
const archiveLevel1IDDev = '745644736341344276';
const archiveLevel1IDProd = '615702601354182706';
const archiveLevel2IDDev = '1383647619448045659';
const archiveLevel2IDProd = '845039809402634240';
const guildIDDev = '365879579887534080';
const guildIDProd = '613464665661636648';
const modboardIDDev = '1423146320037941301';
const modboardIDProd = '1366482618140459170';
const starboardIDDev = '1347392583050985612';
const starboardIDProd = '786775284484669460';
const selfPromoIDDev = '1384235493931094136';
const selfPromoIDProd = '705272855159635969';
const roleMenuIDDev = '1342571477865730089';
const roleMenuIDProd = '975067933673914388';
const rulesIDDev = '1342581100123258952';
const rulesIDProd = '844989137551228978';
const reportIDDev = '957645821531258930';
const reportIDProd = '705532389744705616';
const stickIDDev = '1384270923196272881';
const stickIDProd = '742919732478607460';
const welcomeID = '613468039010320415';
const artistRoleMenuID = '616100468526940195';
const partnersID = '797240025653051402';
const modLogID = '705478973651419167';
const botCommandsID = '702927203360571483';
const staffHelpID = '909151861892866158';
const staffID = '705463143882686564';
const staffBotID = '685566940122447887';
const staffPartnerID = '832352549164154900';
const redditID = '700486332979609671';
const ownerID = '236394260553924608';

module.exports = {
  stickID: isDev() ? stickIDDev : stickIDProd,
  announcementsID: isDev() ? announcementsIDDev : announcementsIDProd,
  archival1ID: isDev() ? archiveLevel1IDDev : archiveLevel1IDProd,
  archival2ID: isDev() ? archiveLevel2IDDev : archiveLevel2IDProd,
  guildIDs: isDev() ? [guildIDDev] : [guildIDDev, guildIDProd],
  guildID: isDev() ? guildIDDev : guildIDProd,
  starboardID: isDev() ? starboardIDDev : starboardIDProd,
  modboardID: isDev() ? modboardIDDev : modboardIDProd,
  selfPromoID: isDev() ? selfPromoIDDev : selfPromoIDProd,
  roleMenuID: isDev() ? roleMenuIDDev : roleMenuIDProd,
  rulesID: isDev() ? rulesIDDev : rulesIDProd,
  adminID: isDev() ? reportIDDev : reportIDProd,
  reportID: isDev() ? reportIDDev : reportIDProd,
  staffID, staffHelpID, welcomeID, artistRoleMenuID, partnersID,
  modLogID, botCommandsID, staffBotID, staffPartnerID, redditID, ownerID
}
