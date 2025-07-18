import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserResetPassword } from '../../../redux/slices/authSlice';
import { Helmet } from 'react-helmet';

export default function VerifyCode() {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [apiSuccess, setApiSucces] = useState("Reset code sent to your email");

    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        resetCode: Yup.string().required("ResetCode is required").matches(/^[0-9]{2,6}$/, "This code is invalid.")
    });

    async function verifyCode(values) {
        try {
            setLoading(true)
            let { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", values);
            if (data.status == "Success") {
                dispatch(setUserResetPassword(true));
                navigate("/reset-password");
            }
        } catch (error) {
            setApiSucces(null);
            setApiError(error.response.data.message);
            setLoading(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            "resetCode": "",
        },
        validationSchema,
        onSubmit: verifyCode
    })

    return (
        <>
            <Helmet>
                <title>Verify Code</title>
            </Helmet>
            <section className="py-10 px-12">
                <div className="flex justify-center uppercase font-bold">
                    <h2 className="w-fit relative text-3xl tracking-wide after:w-1/3 after:h-[1px] after:bg-main after:absolute after:-bottom-3 after:start-1/2 after:-translate-x-1/2 text-[#3e445a]">
                        Account Verification code
                    </h2>
                </div>
                <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto pt-10">
                    {apiError && <div className="text-white text-lg  mb-6 flex justify-center">
                        <div className="bg-red-500 w-fit py-1 px-3 flex">
                            <div className="me-1 mt-[6.9px] rounded-full size-4 border bg-white flex justify-center items-center"><i className="fa-solid fa-exclamation text-sm text-main"></i></div>Failed : {apiError}</div>
                    </div>}
                    {apiSuccess && <div className="text-white text-lg  mb-6 flex justify-center">
                        <div className="bg-green-500 w-fit py-1 px-3 flex items-center">
                            <i className="fa-solid fa-thumbs-up fa-bounce text-xl text-white me-2"></i>Done : {apiSuccess}</div>
                    </div>}
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="tel" name="resetCode" id="resetCode" value={formik.values.resetCode} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-main peer"
                            placeholder=" " />
                        <label htmlFor="resetCode"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-main  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Enter Reset Code :
                        </label>
                        {formik.errors.resetCode && formik.touched.resetCode && <div className="text-red-500 text-sm mt-2 ms-2 whitespace-pre-wrap">
                            {formik.errors.resetCode}
                        </div>}
                    </div>

                    <button type="submit" disabled={loading}
                        className={`text-white bg-[#303841] ${loading ? "bg-gray-600" : "hover:bg-main cursor-pointer"}  focus:ring-1 focus:outline-none focus:ring-red-300 font-medium  text-sm w-full sm:w-auto px-3 py-2.5 text-center`}>
                        <span className="pe-2">{loading ? "Loading" : "Verify"}</span>
                        {loading ?
                            <i className="fa-solid fa-spinner fa-spin-pulse"></i> :
                            <i className="fa-solid fa-check -mb-1"></i>
                        }
                    </button>

                </form>
            </section>
        </>
    );
}