-- ========================================================
-- ShopeeFood Database Schema (Strict)
-- ========================================================

CREATE DATABASE ShopeeFood;
GO
USE ShopeeFood;
GO

-- ===================== USERS & ROLES =====================

CREATE TABLE Users (
	UserId VARCHAR(10) PRIMARY KEY,
	FullName NVARCHAR(50) NOT NULL,
	BirthDate DATE NOT NULL,
	PhoneNumber VARCHAR(10) UNIQUE NOT NULL,
	Email VARCHAR(50) UNIQUE NOT NULL,
	AddressDelivery NVARCHAR(100) NOT NULL,
	Passwords VARCHAR(255) NOT NULL,
	ShopeeCoins INT DEFAULT 0 CHECK (ShopeeCoins >= 0),
	IsActive BIT DEFAULT 1
);

CREATE TABLE Roles (
	RoleId VARCHAR(10) PRIMARY KEY,
	RoleName NVARCHAR(50) NOT NULL
);

INSERT INTO Roles (RoleId, RoleName) VALUES
('RO00001', N'Người dùng'),
('RO00002', N'Admin'),
('RO00003', N'Chủ quán'),
('RO00004', N'Tài xế');

CREATE TABLE UserRoles (
	UserId VARCHAR(10) NOT NULL,
	RoleId VARCHAR(10) NOT NULL,
	AssignedDate DATETIME DEFAULT GETDATE(),
	PRIMARY KEY (UserId, RoleId),
	FOREIGN KEY (UserId) REFERENCES Users(UserId),
	FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

-- ===================== MERCHANT & DRIVER =====================

CREATE TABLE Merchants (
	MerchantId VARCHAR(10) PRIMARY KEY,
	UserId VARCHAR(10) NOT NULL,
	StoreName NVARCHAR(100) NOT NULL,
	StoreAddress NVARCHAR(100) NOT NULL,
	OpenTime TIME NOT NULL,
	CloseTime TIME NOT NULL,
	ActiveStatus BIT NOT NULL DEFAULT 1,
	ShopType NVARCHAR(50) NOT NULL,
	FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Drivers (
	UserId VARCHAR(10) PRIMARY KEY,
    LicensePlate VARCHAR(15) NOT NULL,
    VehicleType NVARCHAR(50) NOT NULL,
    IsOnline BIT NOT NULL DEFAULT 1,
    Latitude DECIMAL(9,6) NULL,
    Longitude DECIMAL(9,6) NULL,
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE MerchantApplications (
	ApplicationId VARCHAR(10) PRIMARY KEY,
	UserId VARCHAR(10) NOT NULL,
	StoreName NVARCHAR(100) NOT NULL,
	StoreAddress NVARCHAR(100) NOT NULL,
	ShopType NVARCHAR(50) NOT NULL,
	ApplicationStatus NVARCHAR(20) DEFAULT N'Pending', -- Pending, Approved, Rejected
	ApplicationDate DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- ===================== MENU & FOOD =====================

CREATE TABLE Categories (
	CategoryId VARCHAR(10) PRIMARY KEY,
	CategoryName NVARCHAR(50) NOT NULL,
);

INSERT INTO Categories (CategoryId, CategoryName) VALUES
('C001', N'Thức uống'),
('C002', N'Đồ ăn'),
('C003', N'Đồ chay'),
('C004', N'Bánh kem'),
('C005', N'Tráng miệng'),
('C006', N'Pizza/Burger'),
('C007', N'Món lẩu'),
('C008', N'Sushi'),
('C009', N'Mì'),
('C010', N'Phở'),
('C011', N'Bún'),
('C012', N'Cơm hộp');

CREATE TABLE MerchantCategories	(
	MerchantId VARCHAR(10) NOT NULL,
	CategoryId VARCHAR(10) NOT NULL,
	PRIMARY KEY(MerchantId, CategoryId),
	FOREIGN KEY (MerchantId) REFERENCES Merchants(MerchantId),
	FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);

CREATE TABLE FoodItems (
	FoodId VARCHAR(10) PRIMARY KEY,
	CategoryId VARCHAR(10) NOT NULL,
	MerchantId VARCHAR(10) NOT NULL,
	FoodName NVARCHAR(50) NOT NULL,
	OriginalPrice BIGINT CHECK (OriginalPrice >= 0),
	SalePrice BIGINT CHECK (SalePrice >= 0),
	FoodImage VARCHAR(255),
	Descriptions NVARCHAR(255),
	FoodStatus INT NOT NULL DEFAULT 1
	FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
	FOREIGN KEY (MerchantId) REFERENCES Merchants(MerchantId)
);

CREATE TABLE ToppingOptions (
	ToppingId VARCHAR(10) PRIMARY KEY,
	MerchantId VARCHAR(10) NOT NULL,
	ToppingName NVARCHAR(50) NOT NULL,
	Price BIGINT CHECK (Price >= 0),
	FOREIGN KEY (MerchantId) REFERENCES Merchants(MerchantId)
);

CREATE TABLE FoodToppings (
	FoodId VARCHAR(10) NOT NULL,
	ToppingId VARCHAR(10) NOT NULL,
	PRIMARY KEY (FoodId, ToppingId),
	FOREIGN KEY (FoodId) REFERENCES FoodItems(FoodId),
	FOREIGN KEY (ToppingId) REFERENCES ToppingOptions(ToppingId)
);

-- ===================== CART =====================

CREATE TABLE Carts (
	CartId VARCHAR(10) PRIMARY KEY,
	UserId VARCHAR(10) NOT NULL,
	MerchantId VARCHAR(10) NOT NULL,
	CreatedAt DATETIME DEFAULT GETDATE(),
	SubtotalPrice BIGINT CHECK (SubtotalPrice >= 0),
	FOREIGN KEY (UserId) REFERENCES Users(UserId),
	FOREIGN KEY (MerchantId) REFERENCES Merchants(MerchantId)
);

CREATE TABLE CartItems (
	CartItemId VARCHAR(10) PRIMARY KEY,
	CartId VARCHAR(10) NOT NULL,
	FoodId VARCHAR(10) NOT NULL,
	Quantity INT CHECK (Quantity > 0),
	Note NVARCHAR(255) null,
	FOREIGN KEY (CartId) REFERENCES Carts(CartId),
	FOREIGN KEY (FoodId) REFERENCES FoodItems(FoodId)
);

CREATE TABLE CartItemToppings (
	CartToppingId VARCHAR(10) PRIMARY KEY,
	CartItemId VARCHAR(10) NOT NULL,
	ToppingId VARCHAR(10) NOT NULL,
	FOREIGN KEY (CartItemId) REFERENCES CartItems(CartItemId),
	FOREIGN KEY (ToppingId) REFERENCES ToppingOptions(ToppingId)
);

-- ===================== VOUCHER =====================

CREATE TABLE Vouchers (
	VoucherId VARCHAR(10) PRIMARY KEY,
	VoucherCode VARCHAR(20) UNIQUE NOT NULL,
	VoucherType NVARCHAR(50) NOT NULL,
	DiscountValue BIGINT CHECK (DiscountValue >= 0),
	MinOrderValue BIGINT DEFAULT 0,
	MaxUsage INT DEFAULT 1,
	StartDate DATETIME,
	EndDate DATETIME,
	IsActive BIT DEFAULT 1,
	MerchantId VARCHAR(10) NOT NULL,
	FOREIGN KEY (MerchantId) REFERENCES Merchants(MerchantId)
);

-- ===================== ORDERS =====================

CREATE TABLE Orders (
    OrderId VARCHAR(10) PRIMARY KEY,
    UserId VARCHAR(10) NOT NULL,
    MerchantId VARCHAR(10) NOT NULL,
    DriverId VARCHAR(10) NULL, 
    VoucherId VARCHAR(10) NULL, 
    OrderTime DATETIME DEFAULT GETDATE(),
    PickupTime DATETIME NULL,
    DeliveryTime DATETIME NULL,
    FoodAmount BIGINT NOT NULL,       
    ShippingFee BIGINT NOT NULL, 
    FoodDiscount BIGINT DEFAULT 0,    
    ShipDiscount BIGINT DEFAULT 0,   
    FinalAmount AS (
        (FoodAmount - FoodDiscount) + (ShippingFee - ShipDiscount)
    ),
    OrderStatus INT NOT NULL DEFAULT 1,
    DeliveryAddress NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (MerchantId) REFERENCES Merchants(MerchantId),
    FOREIGN KEY (DriverId) REFERENCES Drivers(UserId), 
    FOREIGN KEY (VoucherId) REFERENCES Vouchers(VoucherId)
);

CREATE TABLE OrderItems (
	OrderItemId VARCHAR(10) PRIMARY KEY,
	OrderId VARCHAR(10) NOT NULL,
	FoodId VARCHAR(10) NOT NULL,
	Quantity INT CHECK (Quantity > 0),
	UnitPrice BIGINT NOT NULL,
	FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
	FOREIGN KEY (FoodId) REFERENCES FoodItems(FoodId)
);

CREATE TABLE OrderItemToppings (
	OrderToppingId VARCHAR(10) PRIMARY KEY,
    OrderItemId VARCHAR(10) NOT NULL,
    ToppingId VARCHAR(10) NOT NULL, 
    Price BIGINT NOT NULL,  
    FOREIGN KEY (OrderItemId) REFERENCES OrderItems(OrderItemId),
    FOREIGN KEY (ToppingId) REFERENCES ToppingOptions(ToppingId) 
);

-- ===================== PAYMENT & REVIEW =====================

CREATE TABLE Payments (
	PaymentId VARCHAR(10) PRIMARY KEY,
	OrderId VARCHAR(10) UNIQUE NOT NULL,
	Amount BIGINT NOT NULL,
	PaymentMethod NVARCHAR(50),
	PaymentDate DATETIME DEFAULT GETDATE(),
	PaymentStatus BIT NOT NULL DEFAULT 1,
	FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);

CREATE TABLE Reviews (
	ReviewId VARCHAR(10) PRIMARY KEY,
	OrderId VARCHAR(10) NOT NULL,
	Rating TINYINT NULL CHECK (Rating BETWEEN 1 AND 5),
	Comment NVARCHAR(255),
	ReviewType NVARCHAR(50),
	MediaUrl VARCHAR(255),
	CreatedAt DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);
