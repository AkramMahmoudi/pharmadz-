import zipfile
import xml.etree.ElementTree as ET
import json
import os
from datetime import datetime, timedelta

def excel_date_to_str(val):
    if not val:
        return ''
    try:
        f = float(val)
        dt = datetime(1899, 12, 30) + timedelta(days=f)
        return dt.strftime('%d/%m/%Y')
    except:
        return str(val).strip()

CATEGORIES = {
    "01": {"fr": "Antihistaminiques & Antiallergiques", "ar": "مضادات الحساسية والهيستامين", "icon": "🤧"},
    "02": {"fr": "Anesthésie & Réanimation", "ar": "التخدير والإنعاش", "icon": "💉"},
    "03": {"fr": "Antalgiques, Antipyrétiques & Antispasmodiques", "ar": "مسكنات الألم وخافضات الحرارة ومضادات التشنج", "icon": "💊"},
    "04": {"fr": "Anti-inflammatoires & Antirhumatismaux", "ar": "مضادات الالتهاب والروماتيزم", "icon": "🩹"},
    "05": {"fr": "Cancérologie & Oncologie", "ar": "أدوية السرطان والأورام", "icon": "🔬"},
    "06": {"fr": "Cardiologie & Angéiologie", "ar": "أمراض القلب والأوعية الدموية", "icon": "❤️"},
    "07": {"fr": "Dermatologie", "ar": "الأمراض الجلدية", "icon": "🧴"},
    "08": {"fr": "Produits de Diagnostic & Radiologie", "ar": "مواد التشخيص والأشعة", "icon": "🩺"},
    "09": {"fr": "Endocrinologie & Hormonologie", "ar": "الغدد الصماء والهرمونات", "icon": "🧬"},
    "10": {"fr": "Gastro-Entérologie & Hépatologie", "ar": "الجهاز الهضمي والكبد", "icon": "🍽️"},
    "11": {"fr": "Gynécologie & Obstétrique", "ar": "أمراض النساء والتوليد", "icon": "🤰"},
    "12": {"fr": "Hématologie & Hémostase (Antithrombotiques)", "ar": "تخثر وسيولة الدم", "icon": "🩸"},
    "13": {"fr": "Infectiologie (Antibiotiques & Antifongiques)", "ar": "المضادات الحيوية والالتهابات الجرثومية", "icon": "🦠"},
    "14": {"fr": "Métabolisme & Diabète", "ar": "السكري والتمثيل الغذائي", "icon": "🍏"},
    "15": {"fr": "Neurologie & Antiépileptiques", "ar": "الجهاز العصبي والصرع", "icon": "🧠"},
    "16": {"fr": "Psychiatrie & Psychotropes", "ar": "الطب النفسي والمهدئات", "icon": "🧘"},
    "17": {"fr": "Ophtalmologie", "ar": "طب وجراحة العيون", "icon": "👁️"},
    "18": {"fr": "Oto-Rhino-Laryngologie (ORL)", "ar": "الأنف والأذن والحنجرة", "icon": "👂"},
    "19": {"fr": "Parasitologie & Vermifuges", "ar": "مضادات الطفيليات والديدان", "icon": "🐛"},
    "20": {"fr": "Pneumologie & Antiasthmatiques", "ar": "الجهاز التنفسي والربو", "icon": "🫁"},
    "21": {"fr": "Rhumatologie & Traumatologie locale", "ar": "الروماتيزم ومسكنات المفاصل الموضعية", "icon": "🦴"},
    "22": {"fr": "Rhinologie, Toux & États grippaux", "ar": "علاجات الزكام والرشح والسعال", "icon": "🌿"},
    "23": {"fr": "Stomatologie & Soins bucco-dentaires", "ar": "طب وصحة الأسنان والفم", "icon": "🦷"},
    "24": {"fr": "Toxicologie, Antidotes & Chélateurs", "ar": "مضادات السموم وإزالة المعادن", "icon": "🧪"},
    "25": {"fr": "Urologie & Néphrologie", "ar": "المسالك البولية والكلى", "icon": "💧"},
    "26": {"fr": "Antiseptiques & Désinfectants", "ar": "المطهرات والمعقمات", "icon": "🧼"},
    "27": {"fr": "Immunosuppresseurs & Immunologie", "ar": "مثبطات المناعة والمناعة الحيوية", "icon": "🛡️"},
    "28": {"fr": "Thérapies Innovantes & Enzymes", "ar": "علاجات إنزيمية وبيولوجية مبتكرة", "icon": "💡"}
}

xlsx_path = 'clean_NOMENCLATURE.VERSION.AOUT_.2026-.xlsx'

with zipfile.ZipFile(xlsx_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in ss_root.findall('.//ns:si', ns):
            texts = [t.text or '' for t in si.findall('.//ns:t', ns)]
            shared_strings.append(''.join(texts))

    def parse_sheet(sheet_rel_path, start_row, source_type):
        sheet_xml = z.open(sheet_rel_path)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        items = []
        for event, elem in ET.iterparse(sheet_xml, events=('end',)):
            if elem.tag.endswith('row'):
                r = int(elem.attrib.get('r', 0))
                if r >= start_row:
                    cells = {}
                    for c in elem.findall('.//ns:c', ns):
                        cell_ref = c.attrib.get('r')
                        t = c.attrib.get('t')
                        v = c.find('ns:v', ns)
                        val = v.text if v is not None else ''
                        if t == 's' and val.isdigit():
                            val = shared_strings[int(val)]
                        col_letter = ''.join([ch for ch in cell_ref if ch.isalpha()])
                        cells[col_letter] = val.strip()
                    
                    # Must have at least registration, code, brand or dci
                    brand = cells.get('E', '')
                    dci = cells.get('D', '')
                    code = cells.get('C', '')
                    reg = cells.get('B', '')
                    
                    if (brand or dci) and code:
                        cat_id = code.split()[0] if code else '00'
                        if len(cat_id) == 1:
                            cat_id = '0' + cat_id
                        
                        item = {
                            "id": len(items) + 1,
                            "num": cells.get('A', ''),
                            "reg": reg,
                            "code": code,
                            "cat_id": cat_id,
                            "dci": dci,
                            "brand": brand,
                            "form": cells.get('F', ''),
                            "dosage": cells.get('G', ''),
                            "pkg": cells.get('H', ''),
                            "list": cells.get('I', ''),
                            "p1": cells.get('J', ''),
                            "p2": cells.get('K', ''),
                            "obs": cells.get('L', '') if source_type != 'withdrawn' else '',
                            "lab": cells.get('M', '') if source_type != 'withdrawn' else cells.get('L', ''),
                            "country": cells.get('N', '') if source_type != 'withdrawn' else cells.get('M', ''),
                            "date_init": excel_date_to_str(cells.get('O', '')) if source_type != 'withdrawn' else excel_date_to_str(cells.get('N', '')),
                            "date_final": excel_date_to_str(cells.get('P', '')) if source_type != 'withdrawn' else '',
                            "type": cells.get('Q', '') if source_type != 'withdrawn' else cells.get('O', ''),
                            "statut": cells.get('R', '') if source_type != 'withdrawn' else cells.get('P', ''),
                            "stability": cells.get('S', '') if source_type == 'active' else '',
                            "source": source_type
                        }
                        if source_type == 'withdrawn':
                            item['withdrawal_date'] = excel_date_to_str(cells.get('Q', ''))
                            item['withdrawal_reason'] = cells.get('R', '')
                        items.append(item)
                elem.clear()
        return items

    print("Parsing Sheet 1 (Active)...")
    active_items = parse_sheet('xl/worksheets/sheet1.xml', 17, 'active')
    print(f"Active items: {len(active_items)}")

    print("Parsing Sheet 2 (Non Renewed)...")
    non_renewed_items = parse_sheet('xl/worksheets/sheet2.xml', 13, 'non_renewed')
    print(f"Non-renewed items: {len(non_renewed_items)}")

    print("Parsing Sheet 3 (Withdrawn)...")
    withdrawn_items = parse_sheet('xl/worksheets/sheet3.xml', 12, 'withdrawn')
    print(f"Withdrawn items: {len(withdrawn_items)}")

# Calculate category stats for active
cat_stats = {}
for cid, info in CATEGORIES.items():
    cat_stats[cid] = {
        "id": cid,
        "name_fr": info["fr"],
        "name_ar": info["ar"],
        "icon": info["icon"],
        "count": 0,
        "ge_count": 0,
        "re_count": 0
    }

for item in active_items:
    cid = item["cat_id"]
    if cid in cat_stats:
        cat_stats[cid]["count"] += 1
        if item["type"] == "GE":
            cat_stats[cid]["ge_count"] += 1
        elif item["type"] == "RE":
            cat_stats[cid]["re_count"] += 1

dataset = {
    "generated_at": datetime.now().isoformat(),
    "version": "Août 2024 - 2026",
    "stats": {
        "total_active": len(active_items),
        "total_non_renewed": len(non_renewed_items),
        "total_withdrawn": len(withdrawn_items),
        "generics_active": sum(1 for x in active_items if x['type'] == 'GE'),
        "princeps_active": sum(1 for x in active_items if x['type'] == 'RE'),
        "biosimilars_active": sum(1 for x in active_items if x['type'] == 'BIO'),
        "local_active": sum(1 for x in active_items if x['statut'] == 'F'),
        "imported_active": sum(1 for x in active_items if x['statut'] == 'I'),
    },
    "categories": cat_stats,
    "active": active_items,
    "non_renewed": non_renewed_items,
    "withdrawn": withdrawn_items
}

os.makedirs('data', exist_ok=True)

# Write JSON
json_path = 'data/medications.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(dataset, f, ensure_ascii=False)
print(f"Wrote {json_path} ({os.path.getsize(json_path)/1024/1024:.2f} MB)")

# Write JS file for direct offline opening
js_path = 'data/medications_data.js'
with open(js_path, 'w', encoding='utf-8') as f:
    f.write("// Algerian Pharmaceutical Nomenclature Database (Août 2024 - 2026)\n")
    f.write("window.NOMENCLATURE_DATA = ")
    json.dump(dataset, f, ensure_ascii=False)
    f.write(";\n")
print(f"Wrote {js_path} ({os.path.getsize(js_path)/1024/1024:.2f} MB)")
