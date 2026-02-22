package com.mycompany.datashopeefood;

import com.github.javafaker.Faker;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

public class DataShopeeFood {

    static Faker faker = new Faker(new Locale("vi"));
    static Random random = new Random();
    static SimpleDateFormat fmtDate = new SimpleDateFormat("yyyy-MM-dd");
    static SimpleDateFormat fmtDateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    static String OUTPUT = "output_csv";
    static List<String> danhSachIdUser = new ArrayList<>();
    static List<String> danhSachIdMerchant = new ArrayList<>();
    static List<String> danhSachIdDriver = new ArrayList<>();
    static List<String> danhSachIdFood = new ArrayList<>();
    static List<String> danhSachIdVoucher = new ArrayList<>();

    static Map<String, String> mapFoodSangMerchant = new HashMap<>();
    static Map<String, Long> mapFoodSangGiaTien = new HashMap<>();
    static Map<String, String> mapMerchantSangCategory = new HashMap<>();
    static Map<String, String[]> mapVoucherInfo = new HashMap<>();

    static Map<String, List<String>> mapMerchantSangFoods = new HashMap<>();
    static Map<String, Long> mapToppingGia = new HashMap<>();
    static Map<String, List<String>> mapFoodSangToppings = new HashMap<>();
    static List<String[]> danhSachOrderItems = new ArrayList<>();

    static String[] DANH_MUC = {"Com","Pho","Bun","Tra sua","An vat","Pizza","Mi","Lau","Banh mi","Tokbokki"};

    static Map<String,String[]> MON_AN_MAU = new HashMap<>();
    static{
        MON_AN_MAU.put("Com",new String[]{"Com tam suon bi","Com ga xoi mo","Com chien duong chau"});
        MON_AN_MAU.put("Pho",new String[]{"Pho bo tai","Pho ga","Pho nam gau"});
        MON_AN_MAU.put("Bun",new String[]{"Bun bo Hue","Bun rieu cua","Bun thit nuong"});
        MON_AN_MAU.put("Tra sua",new String[]{"Tra sua tran chau","Hong tra tac","Tra dao"});
        MON_AN_MAU.put("An vat",new String[]{"Banh trang tron","Ca vien chien","Khoai tay lac"});
        MON_AN_MAU.put("Pizza",new String[]{"Pizza Hai san","Pizza Bo","Pizza Pho mai"});
        MON_AN_MAU.put("Mi",new String[]{"Mi xao bo","Mi thap cam","Mi kho"});
        MON_AN_MAU.put("Lau",new String[]{"Lau thai","Lau bo","Lau hai san"});
        MON_AN_MAU.put("Banh mi",new String[]{"Banh mi thit","Banh mi chao"});
        MON_AN_MAU.put("Tokbokki",new String[]{"Tokbokki pho mai","Lau Tokbokki"});
    }

    public static void main(String[] args) {
        new File(OUTPUT).mkdirs();
        taoRoles();
        taoCategories();
        taoUsers(1000);
        taoUserRoles();
        taoMerchants();
        taoDrivers();
        taoFoodSystem();
        taoVouchers(50);
        taoOrders(3500);
        taoOrderItemToppings();
        taoCarts(500);
        System.out.println("HOAN TAT!");
    }

    static void taoRoles(){
        ghi("Roles","RoleId,RoleName",
                Arrays.asList(
                        "RO00001,Người dùng",
                        "RO00002,Chủ quán ăn",
                        "RO00003,Tài xế",
                        "RO00004,Quản trị viên"
                ));
    }

    static void taoCategories(){
        List<String> lines=new ArrayList<>();
        for(int i=0;i<DANH_MUC.length;i++)
            lines.add(String.format("CA%05d,%s",i+1,DANH_MUC[i]));
        ghi("Categories","CategoryId,CategoryName",lines);
    }

    static void taoUsers(int n){
        List<String> lines=new ArrayList<>();
        Set<String> sdt=new HashSet<>();
        for(int i=0;i<n;i++){
            String id=String.format("US%05d",10000+i);
            danhSachIdUser.add(id);
            String name=faker.name().fullName();
            String birth=fmtDate.format(faker.date().birthday(18,60));
            String phone;
            do phone="09"+(10000000+random.nextInt(89999999));
            while(sdt.contains(phone));
            sdt.add(phone);
            String email=taoEmail(name)+i+"@gmail.com";
            String addr=taoDiaChi();
            String pass="Pass"+(random.nextInt(900)+100)+"@#";
            int coin=random.nextInt(50)*1000;
            lines.add(String.format("%s,%s,%s,%s,%s,%s,%s,%d",
                    id,name,birth,phone,email,xuLy(addr),pass,coin));
        }
        ghi("Users","UserId,FullName,BirthDate,PhoneNumber,Email,AddressDelivery,Passwords,ShopeeCoins",lines);
    }

    static void taoUserRoles(){
        List<String> lines=new ArrayList<>();
        String now=fmtDateTime.format(new Date());
        for(int i=0;i<danhSachIdUser.size();i++){
            String id=danhSachIdUser.get(i);
            lines.add(id+",RO00001,"+now);
            if(i<5) lines.add(id+",RO00004,"+now);
            else if(i<155){ lines.add(id+",RO00002,"+now); danhSachIdMerchant.add(id);}
            else if(i<305){ lines.add(id+",RO00003,"+now); danhSachIdDriver.add(id);}
        }
        ghi("UserRoles","UserId,RoleId,AssignedDate",lines);
    }

    static void taoMerchants(){
        List<String> lines=new ArrayList<>();
        for(int i=0;i<danhSachIdMerchant.size();i++){
            String uid=danhSachIdMerchant.get(i);
            String mid=String.format("ME%05d",10000+i);
            String type=DANH_MUC[random.nextInt(DANH_MUC.length)];
            mapMerchantSangCategory.put(mid,type);
            mapMerchantSangFoods.put(mid,new ArrayList<>());
            lines.add(String.format("%s,%s,Quan %s,%s,06:00:00,22:00:00,1,%s,%d",
                    mid,uid,type,xuLy(taoDiaChi()),type,random.nextInt(3)+3));
        }
        ghi("Merchants","MerchantId,UserId,StoreName,StoreAddress,OpenTime,CloseTime,ActiveStatus,ShopType,Rating",lines);
    }

    static void taoDrivers(){
        List<String> lines=new ArrayList<>();
        for(String uid:danhSachIdDriver){
            lines.add(uid+",59-A1 12345,Honda Wave,1,10.7,106.6,"+fmtDateTime.format(new Date()));
        }
        ghi("Drivers","UserId,LicensePlate,VehicleType,IsOnline,Latitude,Longitude,UpdatedAt",lines);
    }

    static void taoFoodSystem(){
        List<String> foods=new ArrayList<>();
        List<String> tops=new ArrayList<>();
        List<String> ft=new ArrayList<>();
        int f=0,t=0;
        for(String mid:mapMerchantSangCategory.keySet()){
            String type=mapMerchantSangCategory.get(mid);
            String[] menu=MON_AN_MAU.get(type);
            for(String m:menu){
                String fid=String.format("FO%05d",10000+f++);
                danhSachIdFood.add(fid);
                mapFoodSangMerchant.put(fid,mid);
                mapMerchantSangFoods.get(mid).add(fid);
                long price=(20+random.nextInt(40))*1000;
                mapFoodSangGiaTien.put(fid,price);
                foods.add(fid+",CA00001,"+mid+","+m+","+price+","+price+",img.jpg,Mo ta,Dang ban");
                String tid=String.format("TO%05d",10000+t++);
                long topPrice=5000;
                tops.add(tid+","+mid+",Topping,"+topPrice);
                mapToppingGia.put(tid,topPrice);
                mapFoodSangToppings.putIfAbsent(fid,new ArrayList<>());
                mapFoodSangToppings.get(fid).add(tid);
                ft.add(fid+","+tid);
            }
        }
        ghi("FoodItems","FoodId,CategoryId,MerchantId,FoodName,OriginalPrice,SalePrice,FoodImage,Descriptions,FoodStatus",foods);
        ghi("ToppingOptions","ToppingId,MerchantId,ToppingName,Price",tops);
        ghi("FoodToppings","FoodId,ToppingId",ft);
    }

    static void taoVouchers(int n){
        List<String> lines=new ArrayList<>();
        for(int i=0;i<n;i++){
            String id=String.format("VO%05d",10000+i);
            danhSachIdVoucher.add(id);
            mapVoucherInfo.put(id,new String[]{"FOOD","10000","30000"});
            lines.add(id+",VC1234,FOOD,10000,30000,100,"+
                    fmtDateTime.format(new Date())+","+
                    fmtDateTime.format(new Date(System.currentTimeMillis()+1000000000)));
        }
        ghi("Vouchers","VoucherId,VoucherCode,VoucherType,DiscountValue,MinOrderValue,MaxUsage,StartDate,EndDate",lines);
    }

    static void taoOrders(int n){
        List<String> orders=new ArrayList<>();
        List<String> items=new ArrayList<>();
        for(int i=0;i<n;i++){
            String oid=String.format("OD%05d",10000+i);
            String uid=danhSachIdUser.get(random.nextInt(danhSachIdUser.size()));
            String fid=danhSachIdFood.get(random.nextInt(danhSachIdFood.size()));
            long price=mapFoodSangGiaTien.get(fid);
            String mid=mapFoodSangMerchant.get(fid);
            orders.add(oid+","+uid+","+mid+",,,"
                    +fmtDateTime.format(new Date())+",,,"
                    +price+",15000,0,0,4,"+xuLy(taoDiaChi()));
            String oi=String.format("OI%05d",10000+i);
            items.add(oi+","+oid+","+fid+",1,"+price);
            danhSachOrderItems.add(new String[]{oi,fid});
        }
        ghi("Orders","OrderId,UserId,MerchantId,DriverId,VoucherId,OrderTime,PickupTime,DeliveryTime,FoodAmount,ShippingFee,FoodDiscount,ShipDiscount,OrderStatus,DeliveryAddress",orders);
        ghi("OrderItems","OrderItemId,OrderId,FoodId,Quantity,UnitPrice",items);
    }

    static void taoOrderItemToppings(){
        List<String> lines=new ArrayList<>();
        int c=0;
        for(String[] oi:danhSachOrderItems){
            String fid=oi[1];
            if(mapFoodSangToppings.containsKey(fid)){
                String tid=mapFoodSangToppings.get(fid).get(0);
                lines.add(String.format("OT%05d,%s,%s,%d",10000+c++,oi[0],tid,mapToppingGia.get(tid)));
            }
        }
        ghi("OrderItemToppings","OrderToppingId,OrderItemId,ToppingId,Price",lines);
    }

    static void taoCarts(int n){
        List<String> carts=new ArrayList<>();
        List<String> items=new ArrayList<>();
        for(int i=0;i<n;i++){
            String cid=String.format("CR%05d",10000+i);
            String uid=danhSachIdUser.get(random.nextInt(danhSachIdUser.size()));
            String mid=danhSachIdMerchant.get(random.nextInt(danhSachIdMerchant.size()));
            carts.add(cid+","+uid+","+mid+","+fmtDateTime.format(new Date())+",50000");
            items.add(String.format("CI%05d,%s,%s,1,",10000+i,cid,
                    mapMerchantSangFoods.get(mid).get(0)));
        }
        ghi("Carts","CartId,UserId,MerchantId,CreatedAt,SubtotalPrice",carts);
        ghi("CartItems","CartItemId,CartId,FoodId,Quantity,Note",items);
    }

    static void ghi(String name,String header,List<String> lines){
        try(PrintWriter pw=new PrintWriter(new OutputStreamWriter(
                new FileOutputStream(OUTPUT+"/"+name+".csv"), StandardCharsets.UTF_8))){
            pw.write('\ufeff');
            pw.println(header);
            for(String l:lines) pw.println(l);
        }catch(Exception e){e.printStackTrace();}
    }

    static String taoDiaChi(){
        return "So "+(random.nextInt(200)+1)+" Nguyen Hue, Quan 1, TP.HCM";
    }

    static String taoEmail(String s){
        s=Normalizer.normalize(s,Normalizer.Form.NFD);
        s=Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(s).replaceAll("");
        return s.replace(" ","").toLowerCase();
    }

    static String xuLy(String s){
        if(s.contains(",")) return "\""+s+"\"";
        return s;
    }
}