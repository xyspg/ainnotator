import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import Modal from "@/app/components/ui/modal";

export default function PaymentDialog({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) {
    return (
        <Modal showModal={true} setShowModal={onClose}>
            <Card className="p-8 text-2xl">
                <CardHeader>请前往新打开的页面中完成付款</CardHeader>
                <CardBody>
                    <div className="flex flex-row gap-4">
                    <Button color="warning" onClick={onClose}>取消付款</Button>
                    <Button color="primary" onClick={onComplete}>完成付款</Button>
                    </div>
                </CardBody>
            </Card>
        </Modal>
    )
}