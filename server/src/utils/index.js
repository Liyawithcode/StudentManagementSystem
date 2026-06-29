import { ApiError } from "./apiError.js";
import ApiResponse from "./apiResponse.js";
import asyncHandler from "./asyncHandler.js";
import catchAsync from "./catchAsync.js";
import generateToken from "./generateToken.js";
import generateRefreshToken from "./generateRefreshToken.js";
import { sendEmail, sendVerificationOtp } from "./sendEmail.js";
import verifyToken from "./verifyToken.js";
import hashPassword from "./hashPassword.js";
import comparePassword from "./comparePassword.js";
import emailService from "./emailService.js";
import generateOTP from "./otpGenerator.js";
import { generateStudentId, generateFacultyId, generateAdminId, generateCertificateId } from "./idGenerator.js";
import { calculateGPA, calculateResultStats } from "./grading.js";
import { isValidEmail, isValidPhone, isValidPassword } from "./validation.js";
import { hasDateOverlaps, addDays } from "./dateUtils.js";
import { sendSMS } from "./smsService.js";

// New imports
import verifyOTP from "./otpVerifier.js";
import uploadFile from "./uploadFile.js";
import deleteFile from "./deleteFile.js";
import cloudinary from "./cloudinary.js";
import upload from "./multerConfig.js";
import pagination from "./pagination.js";
import buildSearchQuery from "./searchFilter.js";
import buildSortQuery from "./sortData.js";
import validateObjectId from "./validateObjectId.js";
import formatDate from "./dateFormatter.js";
import calculateAge from "./calculateAge.js";
import calculatePercentage from "./calculatePercentage.js";
import calculateGrade from "./calculateGrade.js";
import calculateAttendanceStats from "./attendanceCalculator.js";
import calculateFeeDetails from "./feeCalculator.js";
import generateReport from "./reportGenerator.js";
import generatePDF from "./pdfGenerator.js";
import generateExcel from "./excelGenerator.js";
import generateCSV from "./csvGenerator.js";
import generateBarcode from "./barcodeGenerator.js";
import generateQRCode from "./qrCodeGenerator.js";
import logger from "./logger.js";
import constants from "./constants.js";
import validators from "./validators.js";
import responseMessages from "./responseMessages.js";
import generateRandomString from "./randomString.js";
import generateSlug from "./slugGenerator.js";
import generateUniqueId from "./uniqueIdGenerator.js";
import encrypt from "./encryption.js";
import decrypt from "./decryption.js";
import socketHelper from "./socketHelper.js";
import backupDatabase from "./backupDatabase.js";
import restoreDatabase from "./restoreDatabase.js";
import cacheHelper from "./cacheHelper.js";
import timezoneHelper from "./timezoneHelper.js";
import compressImage from "./imageCompressor.js";
import validateFile from "./fileValidator.js";
import sanitizeInput from "./sanitizeInput.js";

export {
    ApiError,
    ApiResponse,
    asyncHandler,
    catchAsync,
    generateToken,
    generateRefreshToken,
    sendEmail,
    sendVerificationOtp,
    verifyToken,
    hashPassword,
    comparePassword,
    emailService,
    generateOTP,
    generateStudentId,
    generateFacultyId,
    generateAdminId,
    generateCertificateId,
    calculateGPA,
    calculateResultStats,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    hasDateOverlaps,
    addDays,
    sendSMS,
    
    // New utilities exports
    verifyOTP,
    uploadFile,
    deleteFile,
    cloudinary,
    upload,
    pagination,
    buildSearchQuery,
    buildSortQuery,
    validateObjectId,
    formatDate,
    calculateAge,
    calculatePercentage,
    calculateGrade,
    calculateAttendanceStats,
    calculateFeeDetails,
    generateReport,
    generatePDF,
    generateExcel,
    generateCSV,
    generateBarcode,
    generateQRCode,
    logger,
    constants,
    validators,
    responseMessages,
    generateRandomString,
    generateSlug,
    generateUniqueId,
    encrypt,
    decrypt,
    socketHelper,
    backupDatabase,
    restoreDatabase,
    cacheHelper,
    timezoneHelper,
    compressImage,
    validateFile,
    sanitizeInput
};

