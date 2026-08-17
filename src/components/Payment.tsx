import CustomButton from "./CustomButton";

const Payment = () => {
  const openPaymentSheet = async () => {};

  return (
    <>
      <CustomButton
        title="Confirm ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
