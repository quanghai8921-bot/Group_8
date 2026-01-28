import pandas as pd
import random
import string
import datetime
from faker import Faker
from unidecode import unidecode

# Cấu hình Faker
fake = Faker('vi_VN')

# --- CẤU HÌNH SỐ LƯỢNG DATA ---
# Bạn có thể chỉnh số nhỏ hơn để test nhanh, hoặc để nguyên để ra file lớn
NUM_USERS = 10000 
NUM_MERCHANTS = 800
NUM_DRIVERS = 1500
NUM_ORDERS = 8000 
NUM_CARTS = 2000 # Tạo dữ liệu giỏ hàng mẫu

# --- HÀM HỖ TRỢ ---
def make_id(prefix, index):
    # Tạo ID dạng chuỗi cố định + số tăng dần: US10000, US10001...
    return f"{prefix}{10000 + index}"

def generate_phone():
    return f"0{random.randint(3, 9)}{random.randint(10000000, 99999999)}"

def generate_license_plate():
    provinces = [59, 29, 43, 77, 60, 61]
    char = random.choice(string.ascii_uppercase)
    return f"{random.choice(provinces)}-{char}{random.randint(1, 9)} {random.randint(10000, 99999)}"

def get_random_date(start_year=2023, end_year=2024):
    start = datetime.datetime(start_year, 1, 1)
    end = datetime.datetime(end_year, 12, 31)
    return start + (end - start) * random.random()

# --- TỪ ĐIỂN DỮ LIỆU (MAPPING LOGIC) ---
# Đảm bảo logic: Quán Phở -> Bán Phở -> Topping Quẩy/Trứng
STORE_CONTEXT = {
    "Cơm": {
        "Names": ["Cơm Tấm Sài Gòn", "Cơm Gà Xối Mỡ", "Cơm Niêu Quê", "Cơm Văn Phòng"],
        "Foods": ["Cơm sườn bì chả", "Cơm gà xối mỡ", "Cơm chiên dương châu", "Canh khổ qua"],
        "Toppings": [("Thêm cơm", 5000), ("Trứng ốp la", 8000), ("Chả bì", 10000), ("Mỡ hành", 2000)]
    },
    "Bún/Phở": {
        "Names": ["Phở Gia Truyền", "Bún Bò Huế O Nở", "Hủ Tiếu Nam Vang", "Bún Riêu Cua"],
        "Foods": ["Phở bò tái", "Phở gà ta", "Bún bò giò heo", "Hủ tiếu mì", "Bún riêu"],
        "Toppings": [("Quẩy giòn", 5000), ("Trứng chần", 7000), ("Thêm bánh phở", 5000), ("Tiết luộc", 5000)]
    },
    "Trà Sữa": {
        "Names": ["Trà Sữa Nhà Làm", "Bubble Tea", "Cheeze Tea Corner", "Tiger Sugar"],
        "Foods": ["Trà sữa trân châu", "Hồng trà kem cheese", "Sữa tươi đường đen", "Trà lài"],
        "Toppings": [("Trân châu đen", 5000), ("Thạch dừa", 5000), ("Pudding trứng", 7000), ("Kem Cheese", 10000)]
    },
    "Đồ Ăn Vặt": {
        "Names": ["Ăn Vặt Cô Ba", "Bánh Tráng Trộn Diva", "Xiên Que Nướng", "Gà Rán Giòn"],
        "Foods": ["Bánh tráng trộn", "Cá viên chiên", "Khoai tây lắc", "Nem chua rán"],
        "Toppings": [("Sốt phô mai", 5000), ("Tương ớt thêm", 2000), ("Xoài thêm", 5000)]
    }
}

print("--- BẮT ĐẦU QUÁ TRÌNH TẠO DỮ LIỆU (FULL TABLE) ---")

# ---------------------------------------------------------
# 1. USER & ROLE & MAPPING
# ---------------------------------------------------------
print(f"[1/8] Tạo {NUM_USERS} Users và Roles...")
users = []
user_role_maps = []
user_objs = [] # List object để dùng lại
districts = ["Quận 1", "Quận 3", "Quận 5", "Quận 10", "Bình Thạnh", "Phú Nhuận", "Tân Bình"]
roles = [
    {"Role_ID": "RO001", "Role_Name": "Người dùng"},
    {"Role_ID": "RO002", "Role_Name": "Chủ quán ăn"},
    {"Role_ID": "RO003", "Role_Name": "Tài xế"},
    {"Role_ID": "RO004", "Role_Name": "Quản trị viên"}
]

for i in range(NUM_USERS):
    uid = make_id("US", i)
    name = fake.name()
    email_prefix = unidecode(name).lower().replace(" ", "")
    
    u_obj = {
        "User_ID": uid,
        "Full_Name": name,
        "Birth_Date": fake.date_of_birth(minimum_age=18, maximum_age=60),
        "Phone_Number": generate_phone(),
        "Email": f"{email_prefix}{i}@gmail.com",
        "Passwords": "Pass@123" + str(i),
        "Address_Delivery": f"{random.randint(1,999)} {fake.street_name()}, {random.choice(districts)}, TP.HCM",
        "Shopee_Coins": random.choice([0, 0, 0, 1000, 5000])
    }
    users.append(u_obj)
    user_objs.append(u_obj)

# Phân Role
# 7 Admin
for u in user_objs[:7]:
    user_role_maps.append({"User_ID": u["User_ID"], "Role_ID": "RO004", "Assigned_Date": "2023-01-01 00:00:00"})
# Merchants
merch_candidates = user_objs[7:7+NUM_MERCHANTS]
for u in merch_candidates:
    user_role_maps.append({"User_ID": u["User_ID"], "Role_ID": "RO002", "Assigned_Date": "2023-01-01 00:00:00"})
# Drivers
driver_candidates = user_objs[7+NUM_MERCHANTS:7+NUM_MERCHANTS+NUM_DRIVERS]
for u in driver_candidates:
    user_role_maps.append({"User_ID": u["User_ID"], "Role_ID": "RO003", "Assigned_Date": "2023-01-01 00:00:00"})
# All are Users
for u in user_objs:
    user_role_maps.append({"User_ID": u["User_ID"], "Role_ID": "RO001", "Assigned_Date": "2023-01-01 00:00:00"})

# ---------------------------------------------------------
# 2. MERCHANT SYSTEM (Merchant, Menu, Food, Topping, Mapping)
# ---------------------------------------------------------
print(f"[2/8] Tạo Merchant, Menu, Food và Topping...")
merchants = []
categories = []
foods = []
opt_toppings = []
food_top_maps = []

# Cache để dùng cho Order
# Key: Merchant_ID, Value: { "Foods": [list_food_obj], "Toppings": [list_topping_obj] }
merchant_cache = {}

cat_idx, food_idx, top_idx, map_idx = 0, 0, 0, 0

for i, u in enumerate(merch_candidates):
    mid = make_id("ME", i)
    sType = random.choice(list(STORE_CONTEXT.keys()))
    context = STORE_CONTEXT[sType]
    
    merchants.append({
        "Merchant_ID": mid,
        "User_ID": u["User_ID"],
        "Store_Name": f"{random.choice(context['Names'])} - {make_id('', i)}",
        "Store_Address": u["Address_Delivery"],
        "Open_Time": "07:00:00", "Close_Time": "22:00:00",
        "Active_Status": 1, "Shop_Type": sType, "Rating": 5
    })
    
    # Category
    cid = make_id("CA", cat_idx)
    cat_idx += 1
    categories.append({"Category_ID": cid, "Merchant_ID": mid, "Name_Category": "Món Chính"})
    
    # Topping cho quán
    current_shop_toppings = []
    for t_name, t_price in context["Toppings"]:
        tid = make_id("TO", top_idx)
        top_idx += 1
        t_obj = {"Topping_ID": tid, "Merchant_ID": mid, "Name_Option": t_name, "Surcharge": t_price}
        opt_toppings.append(t_obj)
        current_shop_toppings.append(t_obj)
    
    # Food cho quán
    current_shop_foods = []
    for _ in range(random.randint(5, 8)):
        fid = make_id("FO", food_idx)
        food_idx += 1
        fname = random.choice(context["Foods"])
        price = random.choice([30000, 40000, 50000, 60000])
        
        f_obj = {
            "Food_ID": fid, "Category_ID": cid, "Food_Name": fname,
            "Original_Price": price, "Sale_Price": price, # Giả sử ko giảm giá
            "Food_Image": "img.jpg", "Descriptions": "Ngon", "Status_Food": "Còn món"
        }
        foods.append(f_obj)
        current_shop_foods.append(f_obj)
        
        # Map Food -> Topping (Món nào cũng ăn kèm topping của quán)
        for t_obj in current_shop_toppings:
            food_top_maps.append({
                "Mapping_ID": make_id("MP", map_idx),
                "Food_ID": fid,
                "Topping_ID": t_obj["Topping_ID"]
            })
            map_idx += 1
            
    merchant_cache[mid] = {"Foods": current_shop_foods, "Toppings": current_shop_toppings}

# ---------------------------------------------------------
# 3. DRIVER SYSTEM
# ---------------------------------------------------------
print(f"[3/8] Tạo Driver và Location...")
drivers = []
driver_locs = []
for i, u in enumerate(driver_candidates):
    did = make_id("DR", i)
    drivers.append({
        "Driver_ID": did, "User_ID": u["User_ID"],
        "Full_Name": u["Full_Name"], "Birth_Date": u["Birth_Date"],
        "Phone_Number": u["Phone_Number"], "LicensePlate": generate_license_plate(),
        "Vehicle_Type": "Honda Wave", "Is_Verified": 1
    })
    driver_locs.append({
        "Driver_ID": did, "Latitude": 10.776, "Longitude": 106.700,
        "Updated_At": "2024-01-01 00:00:00", "Is_Active": 1
    })

# ---------------------------------------------------------
# 4. VOUCHER
# ---------------------------------------------------------
print(f"[4/8] Tạo Voucher...")
vouchers = []
for i in range(1, 101):
    val = random.choice([10000, 20000, 50000])
    vouchers.append({
        "Voucher_ID": i, "Voucher_Code": f"SALE{i}", "Voucher_Type": "Discount",
        "Discount_Value": val, "Min_Order_Value": val*2, "Max_Usage": 1000,
        "Start_Date": "2023-01-01", "End_Date": "2025-12-31"
    })

# ---------------------------------------------------------
# 5. ORDER SYSTEM (Order, Detail, Detail_Topping, Payment, Review)
# ---------------------------------------------------------
print(f"[5/8] Đang xử lý {NUM_ORDERS} Đơn hàng (Complex Logic)...")
orders = []
order_details = []
od_toppings = [] # Bảng Order_Detail_Topping
payments = []
reviews = []

# Counter global
odt_idx = 0 # Order Detail Topping index
od_idx = 0  # Order Detail index
pay_idx = 0
rev_idx = 0

list_uids = [u["User_ID"] for u in user_objs]
list_drids = [d["Driver_ID"] for d in drivers]
list_mids = list(merchant_cache.keys())

for i in range(NUM_ORDERS):
    if i % 1000 == 0 and i > 0: print(f"   -> {i}/{NUM_ORDERS}...")
    
    oid = make_id("OD", i)
    uid = random.choice(list_uids)
    mid = random.choice(list_mids)
    did = random.choice(list_drids)
    
    # Lấy data từ cache
    m_data = merchant_cache[mid]
    m_foods = m_data["Foods"]
    m_toppings = m_data["Toppings"]
    
    if not m_foods: continue
    
    # Chọn món
    selected_foods = random.sample(m_foods, k=random.randint(1, 3))
    
    total_food_amt = 0
    
    # Tạo Order Detail
    for food in selected_foods:
        qty = random.randint(1, 2)
        unit_price = food["Sale_Price"] # Giá món
        
        detail_id = make_id("DT", od_idx)
        od_idx += 1
        
        # Chọn topping cho món này (0-2 topping)
        chosen_toppings = random.sample(m_toppings, k=random.randint(0, min(2, len(m_toppings))))
        
        topping_total_price = 0
        for top in chosen_toppings:
            # Lưu vào bảng Order_Detail_Topping
            od_toppings.append({
                "OD_Topping_ID": make_id("OT", odt_idx),
                "Order_Detail_ID": detail_id,
                "Topping_Name": top["Name_Option"],
                "Topping_Price": top["Surcharge"]
            })
            odt_idx += 1
            topping_total_price += top["Surcharge"]
            
        # Tính tiền dòng này: (Giá món * SL) + (Giá topping * SL) ?
        # Logic thường: (Giá món + Giá topping) * SL
        line_total = (unit_price + topping_total_price) * qty
        total_food_amt += line_total
        
        order_details.append({
            "Order_Detail_ID": detail_id,
            "Order_ID": oid,
            "Food_ID": food["Food_ID"],
            "Food_Name": food["Food_Name"],
            "Quantity": qty,
            "Unit_Price": unit_price # Lưu giá gốc món ăn
        })

    # Tính toán Order
    ship_fee = random.choice([15000, 25000])
    discount = 0
    vid = None
    
    # Voucher
    if random.random() > 0.7:
        v = random.choice(vouchers)
        if total_food_amt >= v["Min_Order_Value"]:
            vid = v["Voucher_ID"]
            discount = v["Discount_Value"]
            if discount > total_food_amt: discount = total_food_amt
            
    final_amt = total_food_amt + ship_fee - discount
    date_ord = get_random_date(2023, 2024)
    
    orders.append({
        "Order_ID": oid, "User_ID": uid, "Merchant_ID": mid, "Driver_ID": did, "Voucher_ID": vid,
        "Order_Time": date_ord.strftime("%Y-%m-%d %H:%M:%S"),
        "Pickup_Time": (date_ord + datetime.timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"),
        "Delivery_Time": (date_ord + datetime.timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"),
        "Food_Amount": total_food_amt, "Shipping_Fee": ship_fee, "Discount_Amount": discount,
        "Status": 4, "Delivery_Address": "TPHCM"
    })
    
    # Payment
    payments.append({
        "Payment_ID": make_id("PA", pay_idx), "Order_ID": oid,
        "Amount": final_amt, "Payment_Method": "Cash",
        "Payment_Date": (date_ord + datetime.timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"),
        "Status": "Success"
    })
    pay_idx += 1
    
    # Review
    if random.random() > 0.8:
        reviews.append({
            "Review_ID": make_id("RE", rev_idx), "Order_ID": oid,
            "Rating": 5, "Comment": "Good", "Review_Type": "Food",
            "Media_URL": "", "CreatedAt": (date_ord + datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")
        })
        rev_idx += 1

# ---------------------------------------------------------
# 6. CART SYSTEM (Cart, Cart_Item, Cart_Item_Topping)
# ---------------------------------------------------------
print(f"[6/8] Tạo {NUM_CARTS} Giỏ hàng (Để lấp đầy bảng)...")
carts = []
cart_items = []
cart_item_toppings = []
ci_idx = 0
cit_idx = 0

for k in range(NUM_CARTS):
    cid = make_id("CT", k)
    uid = random.choice(list_uids)
    mid = random.choice(list_mids)
    
    m_data = merchant_cache[mid]
    
    carts.append({
        "Cart_ID": cid, "User_ID": uid, "Merchant_ID": mid,
        "Create_At": "2024-01-01 10:00:00", "Subtotal_Price": 0 # Tượng trưng
    })
    
    # Cart Item
    if m_data["Foods"]:
        food = random.choice(m_data["Foods"])
        ci_id = make_id("CI", ci_idx)
        ci_idx += 1
        
        cart_items.append({
            "Cart_Item_ID": ci_id, "Cart_ID": cid, "Food_ID": food["Food_ID"],
            "Quantity": 1, "Note": ""
        })
        
        # Cart Item Topping
        if m_data["Toppings"]:
            top = random.choice(m_data["Toppings"])
            cart_item_toppings.append({
                "Cart_Topping_ID": make_id("CTO", cit_idx),
                "Cart_Item_ID": ci_id, "Topping_ID": top["Topping_ID"]
            })
            cit_idx += 1

# ---------------------------------------------------------
# 7. XUẤT FILE
# ---------------------------------------------------------
print("[7/8] Chuẩn bị Dataframe...")
dfs = {
    "User": pd.DataFrame(users),
    "Role": pd.DataFrame(roles),
    "User_Role_Mapping": pd.DataFrame(user_role_maps),
    "Merchant": pd.DataFrame(merchants),
    "Driver": pd.DataFrame(drivers),
    "Driver_Location": pd.DataFrame(driver_locs),
    "Menu_Category": pd.DataFrame(categories),
    "Food_Item": pd.DataFrame(foods),
    "Option_Topping": pd.DataFrame(opt_toppings),
    "Food_Topping_Mapping": pd.DataFrame(food_top_maps),
    "Voucher": pd.DataFrame(vouchers),
    "Cart": pd.DataFrame(carts),
    "Cart_Item": pd.DataFrame(cart_items),
    "Cart_Item_Topping": pd.DataFrame(cart_item_toppings),
    "Order": pd.DataFrame(orders),
    "Order_Detail": pd.DataFrame(order_details),
    "Order_Detail_Topping": pd.DataFrame(od_toppings),
    "Payment": pd.DataFrame(payments),
    "Review": pd.DataFrame(reviews)
}

print("[8/8] Đang ghi ra Excel (ShopeeFood_Full_Data.xlsx)...")
with pd.ExcelWriter("ShopeeFood_Full_Data.xlsx", engine='openpyxl') as writer:
    for name, df in dfs.items():
        print(f"  -> Sheet: {name} ({len(df)} rows)")
        df.to_excel(writer, sheet_name=name, index=False)

print("\n✅ HOÀN TẤT! ĐÃ CÓ ĐỦ MỌI BẢNG TRONG SCHEMA.")