
const fs = require('fs');
let html = fs.readFileSync('MedhikaArts_complete_module.html', 'utf8');

const reportsStartMarker = '<!-- All Reports Static Dashboard -->';
const reportsStartIdx = html.indexOf(reportsStartMarker);

const listItemsMarker = '<!-- List Items -->';
const listItemsIdx = html.indexOf(listItemsMarker, reportsStartIdx);

const endOfListContainerMarker = '</div>\r\n                    </div>\r\n\r\n                </div>\r\n            </section>';
// wait, the actual ending is lines 2868-2871. Let's just find '<!-- Admin Controls -->' and then the closing divs.
const adminControlsIdx = html.indexOf('<!-- Admin Controls -->', listItemsIdx);
const endOfAdminControls = html.indexOf('</div>\n                            </div>', adminControlsIdx);
const actualEndOfAdminControls = html.indexOf('</div>', endOfAdminControls + '</div>\n                            </div>'.length);
// it's easier to just use string splitting based on lines.

