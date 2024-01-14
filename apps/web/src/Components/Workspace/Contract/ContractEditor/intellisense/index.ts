//@ts-ignore
import tealscriptTypings from "!!raw-loader!@algorandfoundation/tealscript/types/global.d.ts";

export const CustomTypings = `${tealscriptTypings}
    declare class PendingGroup {
    /**
     * Adds ABI method to the pending transaction group. The two type arguments in combination with the
     * name argument are used to form the the method signature to ensure typesafety.
     *
     * @typeParam ArgsType - A tuple type corresponding to the types of the method arguments
     * @typeParam ReturnType - The return type of the method
     *
     * @param params - The parameters of the method call
     *
     */
    addMethodCall<ArgsType, ReturnType>(params: Expand<MethodCallParams<ArgsType>>): void;
    addPayment(params: Expand<PaymentParams>): void;
    addAppCall(params: Expand<AppParams>): void;
    addAssetTransfer(params: Expand<AssetTransferParams>): void;
    addAssetCreation(params: Expand<AssetCreateParams>): void;
    addOnlineKeyRegistration(params: Expand<OnlineKeyRegParams>): void;
    addOfflineKeyRegistration(params: Expand<CommonTransactionParams>): void;
    addAssetConfig(params: Expand<AssetConfigParams>): void;
    addAssetFreeze(params: Expand<AssetFreezeParams>): void;
    submit(): void;
}
type ItxnParams = AppOnChainTransactionParams & Partial<AppParams> & Partial<PaymentParams> & Partial<AssetCreateParams> & Partial<AssetTransferParams>;
abstract class Contract {
    /**
     * Create a contract class that inherits from the given contracts. Inheritance is in order of arguments.
     */
    static extend: typeof classes;
    static approvalProgram: () => bytes;
    static clearProgram: () => bytes;
    static schema: {
        global: {
            numUint: number;
            numByteSlice: number;
        };
        local: {
            numUint: number;
            numByteSlice: number;
        };
    };
    /** The program version to use in the generated TEAL. This is the number used in the "#pragma version" directive */
    programVersion: number;
    itxn: ItxnParams;
    txn: ThisTxnParams;
    txnGroup: Txn[];
    app: Application;
    pendingGroup: PendingGroup;
    /**
     * The method called when creating the application. The default create method will
     * allow the contract to be created via a bare NoOp appcall and throw an error if called
     * with any arguments.
     */
    createApplication(...args: any[]): void;
    /**
     * The method called when attempting to update the application. The default update method will
     * always throw an error
     */
    updateApplication(...args: any[]): void;
    /**
     * The method called when attempting to delete the application. The default delete method will
     * always throw an error
     */
    deleteApplication(...args: any[]): void;
    /**
     * The method called when an account opts-in to the application. The default opt-in method will
     * always throw an error
     */
    optInToApplication(...args: any[]): void;
    /**
     * The method called when an account closes out their local state. The default close-out method
     * will always throw an error
     */
    closeOutOfApplication(...args: any[]): void;
    /**
     * The method called when an account clears their local state. The default ClearState
     * method does nothing. ClearState will always allow a user to delete their local state,
     * reagrdless of logic.
     */
    clearState(): void;
}
abstract class LogicSig {
    /**
     * Create a contract class that inherits from the given contracts. Inheritance is in order of arguments.
     */
    static extend: typeof classes;
    static address: () => bytes;
    static program: () => bytes;
    txn: Txn;
    txnGroup: Txn[];
    /** The program version to use in the generated TEAL. This is the number used in the "#pragma version" directive */
    programVersion: number;
    abstract logic(...args: any[]): void;
}
    `;
