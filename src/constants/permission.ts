export const DEFAULT_PERMISSION:any={
    sadmin:{
        createUser: true,
        readUser: true,
        updateUser: true,
        deleteUser: true,

        createBanner: true,
        readBanner: true,
        updateBanner: true,
        deleteBanner: true,

        createOrder: true,
        readOrder: true,
        updateOrder: true,
        deleteOrder: true,

        createVehicle: true,
        readVehicle: true,
        updateVehicle: true,
        deleteVehicle: true,

        createChallan: true,
        readChallan: true,
        updateChallan: true,
        deleteChallan: true
    },
    admin:{
        createUser: true,
        readUser: true,
        updateUser: true,
        deleteUser: false,

        createBanner: true,
        readBanner: true,
        updateBanner: true,
        deleteBanner: false,

        createOrder: true,
        readOrder: true,
        updateOrder: true,
        deleteOrder: false,

        createVehicle: true,
        readVehicle: true,
        updateVehicle: true,
        deleteVehicle: false,

        createChallan: true,
        readChallan: true,
        updateChallan: true,
        deleteChallan: false
    },
    user:{
        createUser: false,
        readUser: true,
        updateUser: false,
        deleteUser: false,

        createBanner: false,
        readBanner: true,
        updateBanner: false,
        deleteBanner: false,

        createOrder: false,
        readOrder: true,
        updateOrder: false,
        deleteOrder: false,

        createVehicle: false,
        readVehicle: true,
        updateVehicle: false,
        deleteVehicle: false,

        createChallan: false,
        readChallan: true,
        updateChallan: false,
        deleteChallan: false
    }
}