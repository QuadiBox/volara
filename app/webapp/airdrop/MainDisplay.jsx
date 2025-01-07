'use client'
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchAllDocuments, fetchDocumentsWithCondition, fetchDocumentWithCondition, onSnapshotWithCondition, updateDocument } from "@/app/db/firestoreService";
import HomeAmountDisplay from "../HomeAmountDisplay";

const MainDisplay = () => {
    const [actionType, setActionType] = useState('token');
    const [dbUser, setDbUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [pin, setPin] = useState(['', '', '', '']); // Stores each digit of the PIN
    const [pinAvailable, setPinAvailable] = useState(true);
    const [pinCorrect, setPinCorrect] = useState('');

    const [banks, setBanks] = useState([]);

    //Form handling states
    const [formData, setFormData] = useState({
        account_number: '',
        bank_code: '',
        amount: '',
    });
    const [loading, setLoading] = useState('Withdraw');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { user, isLoaded, isSignedIn } = useUser();

    const fetchRequests = async () => {
        try {
            if (user?.id) {
                const pinAvailability = await fetch(`/api/check-pin?id=${user?.id}`);
                const response = await pinAvailability.json();
                if (response) {
                    setPinAvailable(response?.status)
                    
                } else {
                    setPinAvailable(response?.status)
                }
            } else {
                console.log('user id not available yet chillax');
            }
        } catch (error) {
            console.error(error)
        }
    }

    // fetchRequests();
    

    useEffect(() => {

        const fetchRequests = async () => {
            try {
                if (user?.id) {
                    console.log('user id available');
                    const pinAvailability = await fetch(`/api/check-pin?id=${user?.id}`);
                    if (pinAvailability) {
                        setPinAvailable(true)
                        console.log(pinAvailability);
                        
                    } else {
                        setPinAvailable(true)
                        console.log(pinAvailability);
                    }
                } else {
                    console.log('user id not available yet chillax');
                }
            } catch (error) {
                console.error(error)
            }
        }

        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, [isLoaded, isSignedIn]);

    useEffect(() => {

        const fetchRequests = onSnapshotWithCondition(
            'workers',
            'id',
            `${user?.id}`,
            (documents) => {
                setDbUser(documents[0]);
            }

        )

        // Cleanup the listener on component unmount
        return () => fetchRequests();
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        const fetchUser = async () => {
            const activities = await fetchDocumentsWithCondition('activities', 'w_id', `${user?.id}`);
            // const activities = await fetchAllDocuments('activities');

            setTransactions(activities);
        }

        // Cleanup the listener on component unmount
        return () => fetchUser();
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        // Fetch the list of banks from your API endpoint
        const fetchBanks = async () => {
            try {
                const response = await fetch('/api/get-banks'); // Replace with your API endpoint
                const data = await response.json();
                if (data.success) {
                    setBanks(data.banks);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };

        fetchBanks();
    }, []);

    const referalTotal = transactions.filter((elem) => elem?.type === 'referal').reduce((a, b) => a.amount + b.amount, 0);

    const handleDateFormatting = (vlad) => {
        const formatedDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(vlad))
        return (formatedDate);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAmountChange = (e) => {
        const { name, value } = e.target;

        // Ensure the value is a positive integer and does not exceed the balance
        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue) || parsedValue <= 0) {
            setFormData((prev) => ({ ...prev, [name]: '' }));
            setError('Error: Value must be greater than 0');
            return;
        }

        if (parsedValue > dbUser?.balance * 50) { // Assuming `balance` holds the user's current balance
            setFormData((prev) => ({ ...prev, [name]: dbUser?.balance*50 }));
            setError('Error: Insufficient funds');
            return;
        }

        // Reset the error if input is valid
        setFormData((prev) => ({ ...prev, [name]: parsedValue }));
        // console.log({...formData, [name]: parsedValue});
        
        setError('');
    };

    const handleVerifyPin = async () => {
        const verify = await fetch('/api/check-pin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user?.id,
              pin: pin.join(''),
            }),
        });
        const verificationResult = await verify.json();
        setPinCorrect(verificationResult?.isCorrect);
        return (verificationResult?.isCorrect)
    }

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setMessage('');
        setLoading("Verifying...");
        const pinCorrect = await handleVerifyPin();
        console.log('pin verified now, going to perferom withdrawal');
        
        if (pinCorrect === 'correct') {
            try {
                setLoading("Processing...");
                const response = await fetch('/api/withdraw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({...formData, currentDbUser: dbUser}),
                });;
                setLoading("Withdraw");
                console.log('withdrawal completed, awaiting status...');
                setMessage(response.data.message);
            } catch (error) {
                setLoading("Withdraw");
                console.error(error);
                setMessage(error.response?.data?.message || 'An error occured while processing your withdrawal. Kindly try again later');
            } finally {
              setLoading(false);
            }
        } else {
            setMessage('Invalid Pin');
        }
    };


    // Handle the change of the selected bank
    const handleBankChange = (e) => {
        const selectedBankCode = e.target.value;
        setFormData((prev) => ({
            ...prev,
            bank_code: selectedBankCode,
        }));
    };

    const handlePinChange = (e, index, vlad) => {
        const { value } = e.target;

        if (!/^\d*$/.test(value)) return; // Allow only numeric input

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Move to the next input box if a digit is entered
        if (value && index < 3) {
            if (vlad !== 'set') {
                setTimeout(() => {
                    const nextInput = document.querySelectorAll('.typeVer input')[index + 1];
                    nextInput?.focus(); // Use optional chaining to avoid errors
                }, 0);
            } else {
                setTimeout(() => {
                    const nextInput = document.querySelectorAll('.typeset input')[index + 1];
                    nextInput?.focus(); // Use optional chaining to avoid errors
                }, 0);
            }
        }

        // If last box is filled, trigger handleSubmit
        if (index === 3 && value) {
            if (vlad !== 'set') {
                console.log('submitting data now ', newPin);
                handleSubmit();
            } else {
                updateDocument('workers', dbUser?.docId, {w_pin: pin.join('')})
                setPin(['', '', '', ''])
                setPinAvailable(true)
            }
            
        }
    };

    const handlePinPaste = (e, vlad) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').slice(0, 4); // Get only the first 4 characters
        const newPin = [...pin];

        for (let i = 0; i < pasteData.length; i++) {
            if (newPin[i] === '') {
                newPin[i] = pasteData[i];
            }
        }

        setPin(newPin);

        // Auto-focus the last filled box or submit
        const lastFilledIndex = pasteData.length - 1;
        if (lastFilledIndex >= 3) {
            if (vlad !== 'set') {
                console.log('submitting data now ', newPin);
                handleSubmit();
            } else {
                updateDocument('workers', dbUser?.docId, {w_pin: pin.join('')});
                setPin(['', '', '', ''])
                setPinAvailable(true)
            }
        } else {
            if (vlad !== 'set') {
                document.querySelectorAll('.typeVer input')[lastFilledIndex + 1].focus();
            } else {
                document.querySelectorAll('.typeset input')[lastFilledIndex + 1].focus();
            }
            
        }
    };

    const handlePinFocus = (index, vlad) => {
        // Ensure no input box is focused before an empty previous box
        for (let i = 0; i < index; i++) {
            if (!pin[i]) {
                if (vlad !== 'set') {
                    document.querySelectorAll('.typeVer input')[i].focus();
                    break;
                } else {
                    document.querySelectorAll('.typeset input')[i].focus();
                    break;
                }
                
            }
        }
    };


    return (
        <section className="curentCntn">
            <div className="tapregionCntn">
                <button className={`${actionType === "token" && 'active'}`} onClick={() => { setActionType('token') }} type="button">Available Token</button>
                <button className={`${actionType === "withdraw" && 'active'}`} onClick={() => { setActionType('withdraw') }} type="button">Withdraw</button>
            </div>

            {
                actionType === 'token' ? (
                    <>
                        <div className="workerDetailsDisplay">
                            <h4>Total Balance</h4>
                            <HomeAmountDisplay></HomeAmountDisplay>
                            <p>You can withdraw your earnings directly into any bank of your choice, We&apos;ve automated the process to avoid human-related delays. <br /> 1 Volara coin = NGN50</p>

                            <div className="incomeCntn">
                                <div className="unitType">
                                    <img src="/coin.png" alt="coin" />
                                    <h3>Referal Bonus</h3>
                                    <p><img src="/coin.png" alt="coin" /> {referalTotal} <span>Volara coin</span></p>
                                </div>
                                <div className="unitType">
                                    <img src="/coin.png" alt="coin" />
                                    <h3>Passive Income</h3>
                                    <p><img src="/coin.png" alt="coin" /> 0.00 <span>Volara coin</span></p>
                                </div>
                                <div className="unitType">
                                    <img src="/coin.png" alt="coin" />
                                    <h3>Task Income</h3>
                                    <p><img src="/coin.png" alt="coin" /> {dbUser?.balance} <span>Volara coin</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="transactionHistoryCntn">
                            <h2>Recent Transactions</h2>
                            {
                                transactions?.length > 0 ? (
                                    transactions?.map((elem, idx) => (
                                        <div key={`unitTodoxoxo${idx * Math.random()}`} className="unitTransaction" style={{ color: `${elem?.type === "withdrawal" ? "#a53204" : "#78c60b"}` }}>

                                            <i className={`${elem?.type === "withdrawal" ? "icofont-upload" : "icofont-download-alt"}`}></i>
                                            <div className="center">
                                                <h3>{elem?.type} {elem?.type !== "withdrawal" && 'earning'}</h3>
                                                <p>{handleDateFormatting(elem?.date)}</p>
                                            </div>
                                            <div className="right">
                                                {
                                                    elem?.type === "withdrawal" && (
                                                        <p className={`${elem?.status}`}>{elem?.status}</p>
                                                    )
                                                }
                                                <h3>{elem?.type === "withdrawal" ? "-" : "+"}{elem?.amount} <span>Volara coin</span></h3>
                                            </div>
                                        </div>
                                    ))

                                ) : (
                                    <div className="emptyDisplayCntn">
                                        <h2>Your transaction history is empty</h2>
                                    </div>
                                )
                            }
                        </div>
                    </>

                ) : (
                    <form onSubmit={handleSubmit} className="withdrawCntn">
                        <div className="widthdrawalUserDetailCntn">
                            <h2>Withdraw</h2>

                            <div className="unitWithdrawDetailCntn">
                                <label className={formData?.account_number.length > 0 ? 'active-label' : ''}>Account Number</label>
                                <input
                                    type="text"
                                    name="account_number"
                                    value={formData.account_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="selectBank unitWithdrawDetailCntn">
                                <label className={formData?.bank_code.length > 0 ? 'active-label' : ''} htmlFor="bank">Bank Name:</label>
                                <select
                                    id="bank"
                                    value={formData.bank_code}
                                    onChange={handleBankChange}
                                    style={{ width: '100%' }}
                                >
                                    <option value="" disabled>
                                        Select a bank
                                    </option>
                                    {banks?.map((bank) => (
                                        <option key={`ahjsgd_${bank?.code}${Math.random()}`} value={bank.code}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p>Available balance {dbUser?.balance} Volara coin <br /> Your Coin worth: NGN {dbUser?.balance * 50}. 1 Volara coin == NGN50.00<span></span></p>
                            <div className="unitWithdrawDetailCntn">
                                <label className={formData?.amount ? 'active-label' : ''}>Amount in NGN</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                    required
                                />
                                {
                                    error !== '' && (
                                        <p>{error}</p>
                                    )
                                }
                            </div>

                        </div>
                        <div className="pinContainer">
                            {
                                pinAvailable ? ( 
                                    <>
                                        <label>Enter your 4-digits PIN</label>
                                        <div className="pinInputs typeVer">
                                            {pin.map((value, index) => (
                                                <input
                                                    key={`awalagh_${index}`}
                                                    type="text"
                                                    maxLength="1"
                                                    value={value}
                                                    onChange={(e) => handlePinChange(e, index)}
                                                    onPaste={handlePinPaste}
                                                    onFocus={() => handlePinFocus(index)}
                                                    inputMode="numeric"
                                                    required
                                                    className={`${pinCorrect === ''? '': pinCorrect}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label>Set your withdrawal 4-digits PIN</label>
                                        <div className="pinInputs typeset">
                                            {pin.map((value, index) => (
                                                <input
                                                    key={`awalrh_${index}`}
                                                    type="text"
                                                    maxLength="1"
                                                    value={value}
                                                    onChange={(e) => handlePinChange(e, index, 'set')}
                                                    onPaste={(e) => handlePinPaste(e, 'set')}
                                                    onFocus={() => handlePinFocus(index, 'set')}
                                                    inputMode="numeric"
                                                    required
                                                    className={`${pinCorrect === ''? '': pinCorrect}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <div className="withdrawalBtnCntn">
                            <button disabled={pinCorrect === 'correct'? false : true} className={`${pinCorrect !== 'correct' || loading === 'Processing...' ? '' : 'correct'}`} type="submit">{loading}</button>
                            {message && <p>{message}</p>}
                        </div>
                    </form>
                )
            }




        </section>
    )
}

export default MainDisplay
