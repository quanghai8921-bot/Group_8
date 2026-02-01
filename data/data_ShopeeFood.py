import pandas as pd
import random
import string
import datetime
from faker import Faker
from unidecode import unidecode

# Cấu hình Faker
fake = Faker('vi_VN')

# --- CẤU HÌNH SỐ LƯỢNG DATA ---
NUM_USERS = 10000 
NUM_MERCHANTS = 800
NUM_DRIVERS = 1500
NUM_ORDERS = 8000 
NUM_CARTS = 2000

# --- HÀM HỖ TRỢ ---
def make_id(prefix, index):
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

# --- TỪ ĐIỂN DỮ LIỆU ---
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
user_objs = []
districts = ["Quận 1", "Quận 3", "Quận 5", "Quận 10", "Bình Thạnh", "Phú Nhuận", "Tân Bình"]
roles = [
    {"RoleId": "RO001", "RoleName": "Người dùng"},
    {"RoleId": "RO002", "RoleName": "Chủ quán ăn"},
    {"RoleId": "RO003", "RoleName": "Tài xế"},
    {"RoleId": "RO004", "RoleName": "Quản trị viên"}
]

for i in range(NUM_USERS):
    uid = make_id("US", i)
    name = fake.name()
    email_prefix = unidecode(name).lower().replace(" ", "")
    
    u_obj = {
        "UserId": uid,
        "FullName": name,
        "BirthDate": fake.date_of_birth(minimum_age=18, maximum_age=60),
        "PhoneNumber": generate_phone(),
        "Email": f"{email_prefix}{i}@gmail.com",
        "Passwords": "Pass@123" + str(i),
        "AddressDelivery": f"{random.randint(1,999)} {fake.street_name()}, {random.choice(districts)}, TP.HCM",
        "ShopeeCoins": random.choice([0, 0, 0, 1000, 5000])
    }
    users.append(u_obj)
    user_objs.append(u_obj)

# Phân quyền
for u in user_objs[:7]:
    user_role_maps.append({"UserId": u["UserId"], "RoleId": "RO004", "AssignedDate": "2023-01-01 00:00:00"})
merch_candidates = user_objs[7:7+NUM_MERCHANTS]
for u in merch_candidates:
    user_role_maps.append({"UserId": u["UserId"], "RoleId": "RO002", "AssignedDate": "2023-01-01 00:00:00"})
driver_candidates = user_objs[7+NUM_MERCHANTS:7+NUM_MERCHANTS+NUM_DRIVERS]
for u in driver_candidates:
    user_role_maps.append({"UserId": u["UserId"], "RoleId": "RO003", "AssignedDate": "2023-01-01 00:00:00"})
for u in user_objs:
    user_role_maps.append({"UserId": u["UserId"], "RoleId": "RO001", "AssignedDate": "2023-01-01 00:00:00"})

# ---------------------------------------------------------
# 2. MERCHANT SYSTEM
# ---------------------------------------------------------
print(f"[2/8] Tạo Merchants, MenuCategories, FoodItems và Toppings...")
merchants = []
categories = []
foods = []
opt_toppings = []
food_top_maps = []
merchant_cache = {}

cat_idx, food_idx, top_idx, map_idx = 0, 0, 0, 0

for i, u in enumerate(merch_candidates):
    mid = make_id("ME", i)
    sType = random.choice(list(STORE_CONTEXT.keys()))
    context = STORE_CONTEXT[sType]
    
    # Mapping table Merchants
    merchants.append({
        "MerchantId": mid,
        "UserId": u["UserId"],
        "StoreName": f"{random.choice(context['Names'])} - {make_id('', i)}",
        "StoreAddress": u["AddressDelivery"],
        "OpenTime": "07:00:00", "CloseTime": "22:00:00",
        "ActiveStatus": 1, "ShopType": sType, "Rating": 5
    })
    
    # Mapping table MenuCategories
    cid = make_id("CA", cat_idx)
    cat_idx += 1
    categories.append({"CategoryId": cid, "MerchantId": mid, "CategoryName": "Món Chính"})
    
    # Mapping table ToppingOptions
    current_shop_toppings = []
    for t_name, t_price in context["Toppings"]:
        tid = make_id("TO", top_idx)
        top_idx += 1
        t_obj = {"ToppingId": tid, "MerchantId": mid, "ToppingName": t_name, "Surcharge": t_price}
        opt_toppings.append(t_obj)
        current_shop_toppings.append(t_obj)
    
    # Mapping table FoodItems
    current_shop_foods = []
    for _ in range(random.randint(5, 8)):
        fid = make_id("FO", food_idx)
        food_idx += 1
        fname = random.choice(context["Foods"])
        price = random.choice([30000, 40000, 50000, 60000])
        
        f_obj = {
            "FoodId": fid, "CategoryId": cid, "FoodName": fname,
            "OriginalPrice": price, "SalePrice": price,
            "FoodImage": "img.jpg", "Descriptions": "Ngon", "FoodStatus": "Còn món"
        }
        foods.append(f_obj)
        current_shop_foods.append(f_obj)
        
        # Mapping table FoodToppings
        for t_obj in current_shop_toppings:
            food_top_maps.append({
                "FoodId": fid,
                "ToppingId": t_obj["ToppingId"]
            })
            map_idx += 1
            
    merchant_cache[mid] = {"Foods": current_shop_foods, "Toppings": current_shop_toppings}

# ---------------------------------------------------------
# 3. DRIVER SYSTEM
# ---------------------------------------------------------
print(f"[3/8] Tạo Drivers và DriverLocations...")
drivers = []
driver_locs = []
for i, u in enumerate(driver_candidates):
    did = make_id("DR", i)
    # Mapping table Drivers
    drivers.append({
        "DriverId": did, "UserId": u["UserId"],
        "FullName": u["FullName"], "BirthDate": u["BirthDate"],
        "PhoneNumber": u["PhoneNumber"], "LicensePlate": generate_license_plate(),
        "VehicleType": "Honda Wave", "IsVerified": 1
    })
    # Mapping table DriverLocations
    driver_locs.append({
        "DriverId": did, "Latitude": 10.776, "Longitude": 106.700,
        "UpdatedAt": "2024-01-01 00:00:00", "IsActive": 1
    })

# ---------------------------------------------------------
# 4. VOUCHER
# ---------------------------------------------------------
print(f"[4/8] Tạo Vouchers...")
vouchers = []
for i in range(1, 101):
    val = random.choice([10000, 20000, 50000])
    # Mapping table Vouchers
    # Note: VoucherId is IDENTITY in SQL, but we generate here for reference
    vouchers.append({
        "VoucherId": i, "VoucherCode": f"SALE{i}", "VoucherType": "Discount",
        "DiscountValue": val, "MinOrderValue": val*2, "MaxUsage": 1000,
        "StartDate": "2023-01-01", "EndDate": "2025-12-31"
    })

# ---------------------------------------------------------
# 5. ORDER SYSTEM
# ---------------------------------------------------------
print(f"[5/8] Đang xử lý {NUM_ORDERS} Orders...")
orders = []
order_details = []
od_toppings = []
payments = []
reviews = []

odt_idx = 0
od_idx = 0
pay_idx = 0
rev_idx = 0

list_uids = [u["UserId"] for u in user_objs]
list_drids = [d["DriverId"] for d in drivers]
list_mids = list(merchant_cache.keys())

for i in range(NUM_ORDERS):
    if i % 1000 == 0 and i > 0: print(f"   -> {i}/{NUM_ORDERS}...")
    
    oid = make_id("OD", i)
    uid = random.choice(list_uids)
    mid = random.choice(list_mids)
    did = random.choice(list_drids)
    
    m_data = merchant_cache[mid]
    m_foods = m_data["Foods"]
    m_toppings = m_data["Toppings"]
    
    if not m_foods: continue
    
    selected_foods = random.sample(m_foods, k=random.randint(1, 3))
    total_food_amt = 0
    
    for food in selected_foods:
        qty = random.randint(1, 2)
        unit_price = food["SalePrice"]
        
        detail_id = make_id("DT", od_idx)
        od_idx += 1
        
        chosen_toppings = random.sample(m_toppings, k=random.randint(0, min(2, len(m_toppings))))
        
        topping_total_price = 0
        for top in chosen_toppings:
            # Mapping table OrderItemToppings
            od_toppings.append({
                "OrderToppingId": make_id("OT", odt_idx),
                "OrderItemId": detail_id,
                "ToppingName": top["ToppingName"],
                "ToppingPrice": top["Surcharge"]
            })
            odt_idx += 1
            topping_total_price += top["Surcharge"]
            
        line_total = (unit_price + topping_total_price) * qty
        total_food_amt += line_total
        
        # Mapping table OrderItems
        order_details.append({
            "OrderItemId": detail_id,
            "OrderId": oid,
            "FoodId": food["FoodId"],
            "FoodName": food["FoodName"],
            "Quantity": qty,
            "UnitPrice": unit_price
        })

    ship_fee = random.choice([15000, 25000])
    discount = 0
    vid = None
    
    if random.random() > 0.7:
        v = random.choice(vouchers)
        if total_food_amt >= v["MinOrderValue"]:
            vid = v["VoucherId"]
            discount = v["DiscountValue"]
            if discount > total_food_amt: discount = total_food_amt
            
    final_amt = total_food_amt + ship_fee - discount
    date_ord = get_random_date(2023, 2024)
    
    # Mapping table Orders
    orders.append({
        "OrderId": oid, "UserId": uid, "MerchantId": mid, "DriverId": did, "VoucherId": vid,
        "OrderTime": date_ord.strftime("%Y-%m-%d %H:%M:%S"),
        "PickupTime": (date_ord + datetime.timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S"),
        "DeliveryTime": (date_ord + datetime.timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"),
        "FoodAmount": total_food_amt, "ShippingFee": ship_fee, "DiscountAmount": discount,
        "FinalAmount": final_amt, # Note: SQL computes this, but we include for CSV completeness
        "OrderStatus": 4, "DeliveryAddress": "TPHCM"
    })
    
    # Mapping table Payments
    payments.append({
        "PaymentId": make_id("PA", pay_idx), "OrderId": oid,
        "Amount": final_amt, "PaymentMethod": "Cash",
        "PaymentDate": (date_ord + datetime.timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"),
        "PaymentStatus": "Success"
    })
    pay_idx += 1
    
    # Mapping table Reviews
    if random.random() > 0.8:
        reviews.append({
            "ReviewId": make_id("RE", rev_idx), "OrderId": oid,
            "Rating": 5, "Comment": "Good", "ReviewType": "Food",
            "MediaUrl": "", "CreatedAt": (date_ord + datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")
        })
        rev_idx += 1

# ---------------------------------------------------------
# 6. CART SYSTEM
# ---------------------------------------------------------
print(f"[6/8] Tạo {NUM_CARTS} Carts...")
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
    
    # Mapping table Carts
    carts.append({
        "CartId": cid, "UserId": uid, "MerchantId": mid,
        "CreatedAt": "2024-01-01 10:00:00", "SubtotalPrice": 0
    })
    
    if m_data["Foods"]:
        food = random.choice(m_data["Foods"])
        ci_id = make_id("CI", ci_idx)
        ci_idx += 1
        
        # Mapping table CartItems
        cart_items.append({
            "CartItemId": ci_id, "CartId": cid, "FoodId": food["FoodId"],
            "Quantity": 1, "Note": ""
        })
        
        if m_data["Toppings"]:
            top = random.choice(m_data["Toppings"])
            # Mapping table CartItemToppings
            cart_item_toppings.append({
                "CartToppingId": make_id("CTO", cit_idx),
                "CartItemId": ci_id, "ToppingId": top["ToppingId"]
            })
            cit_idx += 1

# ---------------------------------------------------------
# 7. XUẤT FILE CSV
# ---------------------------------------------------------
print("[7/8] Chuẩn bị Dataframes...")
# Tên Keys ở đây PHẢI KHỚP với tên bảng trong SQL
dfs = {
    "Users": pd.DataFrame(users),
    "Roles": pd.DataFrame(roles),
    "UserRoles": pd.DataFrame(user_role_maps),
    "Merchants": pd.DataFrame(merchants),
    "Drivers": pd.DataFrame(drivers),
    "DriverLocations": pd.DataFrame(driver_locs),
    "MenuCategories": pd.DataFrame(categories),
    "FoodItems": pd.DataFrame(foods),
    "ToppingOptions": pd.DataFrame(opt_toppings),
    "FoodToppings": pd.DataFrame(food_top_maps),
    "Vouchers": pd.DataFrame(vouchers),
    "Carts": pd.DataFrame(carts),
    "CartItems": pd.DataFrame(cart_items),
    "CartItemToppings": pd.DataFrame(cart_item_toppings),
    "Orders": pd.DataFrame(orders),
    "OrderItems": pd.DataFrame(order_details),
    "OrderItemToppings": pd.DataFrame(od_toppings),
    "Payments": pd.DataFrame(payments),
    "Reviews": pd.DataFrame(reviews)
}

print("[8/8] Đang ghi ra CSV (ShopeeFood_Data.csv)...")
csv_filename = "ShopeeFood_Data.csv"

with open(csv_filename, 'w', encoding='utf-8-sig', newline='') as f:
    for name, df in dfs.items():
        print(f"  -> Bảng: {name} ({len(df)} rows)")
        # Ghi tên bảng
        f.write(f"Bảng {name}\n")
        # Ghi nội dung dataframe, dùng dấu chấm phẩy làm separator
        df.to_csv(f, index=False, sep=';', lineterminator='\n')
        # Ghi dòng trống ngăn cách
        f.write("\n\n")

print(f"\n✅ HOÀN TẤT! File đã lưu tại: {csv_filename}")