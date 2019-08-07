var authService = require('../controllers/auth');

var managerCategoryController = require('../controllers/category');
var managerClassController = require('../controllers/class');
var managerClassTypeController = require('../controllers/class_type');
var managerHolidayController = require('../controllers/holiday');
var managerMealController = require('../controllers/meal');
var managerConfigController = require('../controllers/config');
var managerManagerController = require('../controllers/manager');
var managerNewsController = require('../controllers/news');
var managerOrderController = require('../controllers/order');
var managerParentController = require('../controllers/parent');
var managerProductController = require('../controllers/product');
var managerReportController = require('../controllers/report');
var managerSchoolController = require('../controllers/school');
var managerStudentController = require('../controllers/student');
var managerTransactionController = require('../controllers/transaction');
var managerThirdPartyController = require('../controllers/third');

const multipart = require('connect-multiparty');  
const multipartMiddlewareSchoolImg = multipart({ uploadDir:  './assets/uploads/img/schools' }); 
const multipartMiddlewareProductImg = multipart({ uploadDir:  './assets/uploads/img/products' }); 

function serverRoutes(app){

    app.post('/login', managerManagerController.login);
    app.post('/changePwd', authService.verifyToken, managerManagerController.changePwd);
    app.get('/logout', managerManagerController.logout);
    app.post('/get_dashboard_info', authService.verifyToken, managerManagerController.getDashboardInfo);

    app.post('/get_parents', authService.verifyToken, managerParentController.getParents);
    app.post('/add_parent', authService.verifyToken, managerParentController.addParent);    
    app.post('/edit_parent', authService.verifyToken, managerParentController.editParent);
    app.post('/get_parent', authService.verifyToken, managerParentController.getParent);
    app.post('/delete_parent', authService.verifyToken, managerParentController.delParent);

    app.post('/get_order_history', authService.verifyToken, managerOrderController.getOrderHistory);
    app.post('/get_orders_count', authService.verifyToken, managerOrderController.getOrdersCount);
    app.post('/get_orders/:parentId', authService.verifyToken, managerOrderController.getOrders);
    app.post('/get_order_detail', authService.verifyToken, managerOrderController.getOrderDetail);
    app.post('/cancel_order', authService.verifyToken, managerOrderController.cancelOrder);

    app.post('/get_students/:parentId', authService.verifyToken, managerStudentController.getStudents);
    app.post('/get_students_count', authService.verifyToken, managerStudentController.getStudentsCount);

    app.post('/get_txns', authService.verifyToken, managerTransactionController.getTxns);

    app.post('/get_classes', authService.verifyToken, managerClassController.getClasses);
    app.post('/add_class', authService.verifyToken, managerClassController.addClass);    
    app.post('/edit_class', authService.verifyToken, managerClassController.editClass);
    app.delete('/delete_class/:id', authService.verifyToken, managerClassController.delClass);
    app.get('/get_class_list', authService.verifyToken, managerClassController.getClassList);

    app.post('/get_class_types', authService.verifyToken, managerClassTypeController.getClassTypes);
    app.post('/add_class_type', authService.verifyToken, managerClassTypeController.addClassType);    
    app.post('/edit_class_type', authService.verifyToken, managerClassTypeController.editClassType);
    app.delete('/delete_class_type/:id', authService.verifyToken, managerClassTypeController.delClassType);
    app.get('/get_class_type_list', authService.verifyToken, managerClassTypeController.getClassTypeList);

    app.post('/get_holidays', authService.verifyToken, managerHolidayController.getHolidays);
    app.post('/add_holiday', authService.verifyToken, managerHolidayController.addHoliday);    
    app.post('/edit_holiday', authService.verifyToken, managerHolidayController.editHoliday);
    app.delete('/delete_holiday/:id', authService.verifyToken, managerHolidayController.delHoliday);

    app.post('/get_meals', authService.verifyToken, managerMealController.getMeals);
    app.post('/add_meal', authService.verifyToken, managerMealController.addMeal);    
    app.post('/edit_meal', authService.verifyToken, managerMealController.editMeal);
    app.delete('/delete_meal/:id', authService.verifyToken, managerMealController.delMeal);
    app.get('/get_meal_list', authService.verifyToken, managerMealController.getMealList);

    app.post('/get_categories', authService.verifyToken, managerCategoryController.getCategories);
    app.post('/add_category', authService.verifyToken, managerCategoryController.addCategory);
    app.post('/edit_category', authService.verifyToken, managerCategoryController.editCategory);
    app.delete('/delete_category/:id', authService.verifyToken, managerCategoryController.delCategory);
    app.get('/get_category_list', authService.verifyToken, managerCategoryController.getCategoryList);
    app.get('/get_categories_cnt', authService.verifyToken, managerCategoryController.getCategoriesCnt);

    app.post('/get_news', authService.verifyToken, managerNewsController.getNews);
    app.post('/add_news', authService.verifyToken, managerNewsController.addNews);
    app.post('/edit_news', authService.verifyToken, managerNewsController.editNews);
    app.delete('/delete_news/:id', authService.verifyToken, managerNewsController.delNews);
    
    app.post('/get_products', authService.verifyToken, managerProductController.getProducts);
    app.get('/get_all_products', authService.verifyToken, managerProductController.getAllProducts);
    app.post('/add_product', authService.verifyToken, managerProductController.addProduct);
    app.post('/edit_product', authService.verifyToken, managerProductController.editProduct);
    app.post('/update_product_option', authService.verifyToken, managerProductController.updateProductOption);
    app.delete('/delete_product/:id', authService.verifyToken, managerProductController.delProduct);
    app.post('/upload_product_img/:productId', authService.verifyToken, multipartMiddlewareProductImg, managerProductController.uploadProductImg);
    app.post('/delete_product_img', authService.verifyToken, managerProductController.delProductImg);

    app.get('/get_school_list', authService.verifyToken, managerSchoolController.getSchoolList);
    app.post('/get_schools', authService.verifyToken, managerSchoolController.getSchools);
    app.post('/edit_school', authService.verifyToken, managerSchoolController.editSchool);
    app.get('/get_school_info', authService.verifyToken, managerSchoolController.getSchoolInfo);
    app.post('/upload_school_logo', authService.verifyToken, multipartMiddlewareSchoolImg, managerSchoolController.uploadSchoolLogo);
    app.post('/auth_stripe', authService.verifyToken, managerSchoolController.authStripe);

    app.post('/send_email', authService.verifyToken, managerThirdPartyController.sendEmail);

    app.get('/check_token_valid', authService.verifyToken, managerThirdPartyController.checkTokenValid);
    
}

module.exports = serverRoutes;
