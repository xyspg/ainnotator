"use client"

import {useState} from "react";
import {Input} from "@/app/components/ui/input";
import placeholder from "lodash/fp/placeholder";
import {Button} from "@/app/components/ui/button";

export const QueryOrder = () => {
    const [orderId, setOrderId] = useState("");
    return (
        <div className='flex flex-col gap-2'>
            <h2 className="mt-12 text-2xl font-bold">Not Seeing Your Order?</h2>
            <p className="text-gray-500">
                输入订单编号来查询
            </p>
            <form  className='flex flex-row gap-2'>
            <Input value={orderId} placeholder="Merchant Order ID" onChange={(event) => {
                setOrderId(event.currentTarget.value);
            } }/>
                <Button>查询</Button>
            </form>

        </div>
)
}