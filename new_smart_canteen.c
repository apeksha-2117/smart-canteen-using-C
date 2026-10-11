#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct Order {
    int token;
    char item[30];
    int quantity;
    float price;
    float total;
};

struct Order orders[100];

int front = 0, rear = -1;
int tokenNumber = 100;
float dailySales = 0;
int totalOrdersPlaced = 0; // FIX: New variable to accurately track day's total orders

void displayMenu() {
    printf("\n===== FOOD MENU =====\n");
    printf("1. Burger       - Rs 80\n");
    printf("2. Pizza        - Rs 120\n");
    printf("3. Tea          - Rs 10\n");
    printf("4. Coffee       - Rs 15\n");
    printf("5. Idli         - Rs 20\n");
    printf("6. Masala Dosa  - Rs 45\n");
    printf("7. Plain Dosa   - Rs 30\n");
    printf("8. Set Dosa     - Rs 40\n");
    printf("9. Mini meals(Rice, papad, pickle, sambar, rasam, buttermilk) - Rs 20\n");
    printf("10. Full meals(Rice, chapathi, papad, pickle, sambar, rasam, buttermilk) - Rs 30\n");
    printf("11. Chapathi    - Rs 20\n");
    printf("12. Paratha     - Rs 30\n");
    printf("13. Curd Rice   - Rs 20\n");
    printf("14. Gobi Manchurian - Rs 30\n");
    printf("15. Panipuri    - Rs 30\n");
    printf("16. Masala Puri - Rs 30\n");
    printf("17. Dahi puri   - Rs 35\n");
    printf("18. French Fries - Rs 60\n");
    printf("19. Churmuri    - Rs 40\n");
    printf("20. Masala Papad - Rs 40\n");
    printf("21. Veg Biryani - Rs 40\n");
    printf("22. Sandwich    - Rs 40\n");
    printf("23. Medu Vada   - Rs 10\n");
    printf("24. Samosa      - Rs 15\n");
    printf("25. Kachori     - Rs 20\n");
}

void placeOrder() {
    // FIX: Prevent array overflow crash
    if (rear >= 99) {
        printf("\nCanteen Queue is Full! Cannot accept more orders right now.\n");
        return;
    }

    int choice, qty;
    rear++;

    displayMenu();

    printf("\nEnter food choice: ");
    scanf("%d", &choice);

    printf("Enter quantity: ");
    scanf("%d", &qty);

    orders[rear].token = tokenNumber++;
    orders[rear].quantity = qty;

    switch(choice) {
        case 1:
            strcpy(orders[rear].item, "Burger");
            orders[rear].price = 80;
            break;
        case 2:
            strcpy(orders[rear].item, "Pizza");
            orders[rear].price = 120;
            break;
        case 3:
            strcpy(orders[rear].item, "Tea");
            orders[rear].price = 10;
            break;
        case 4:
            strcpy(orders[rear].item, "Coffee");
            orders[rear].price = 15;
            break;
        case 5:
            strcpy(orders[rear].item, "Idli");
            orders[rear].price = 20;
            break;
        case 6:
            strcpy(orders[rear].item, "Masala Dosa");
            orders[rear].price = 45;
            break;
        case 7:
            strcpy(orders[rear].item, "Plain Dosa");
            orders[rear].price = 30;
            break;
        case 8:
            strcpy(orders[rear].item, "Set Dosa");
            orders[rear].price = 40;
            break;
        case 9:
            strcpy(orders[rear].item, "Mini meals");
            orders[rear].price = 20;
            break;
        case 10:
            strcpy(orders[rear].item, "Full meals");
            orders[rear].price = 30;
            break;
        case 11:
            strcpy(orders[rear].item, "Chapathi");
            orders[rear].price = 20;
            break;
        case 12:
            strcpy(orders[rear].item, "Paratha");
            orders[rear].price = 30;
            break;
        case 13:
            strcpy(orders[rear].item, "Curd Rice");
            orders[rear].price = 20;
            break;
        case 14:
            strcpy(orders[rear].item, "Gobi Manchurian");
            orders[rear].price = 30;
            break;
        case 15:
            strcpy(orders[rear].item, "Panipuri");
            orders[rear].price = 30;
            break;
        case 16:
            strcpy(orders[rear].item, "Masala Puri");
            orders[rear].price = 30;
            break;
        case 17:
            strcpy(orders[rear].item, "Dahi puri");
            orders[rear].price = 35;
            break;
        case 18:
            strcpy(orders[rear].item, "French Fries");
            orders[rear].price = 60;
            break;
        case 19:
            strcpy(orders[rear].item, "Churmuri");
            orders[rear].price = 40;
            break;
        case 20:
            strcpy(orders[rear].item, "Masala Papad");
            orders[rear].price = 40;
            break;
        case 21:
            strcpy(orders[rear].item, "Veg Biryani");
            orders[rear].price = 40;
            break;
        case 22:
            strcpy(orders[rear].item, "Sandwich");
            orders[rear].price = 40;
            break;
        case 23:
            strcpy(orders[rear].item, "Medu Vada");
            orders[rear].price = 10;
            break;
        case 24:
            strcpy(orders[rear].item, "Samosa");
            orders[rear].price = 15;
            break;
        case 25:
            strcpy(orders[rear].item, "Kachori");
            orders[rear].price = 20;
            break;

        default:
            printf("Invalid choice!\n");
            rear--;
            tokenNumber--; // Rollback token number if choice failed
            return;
    }

    orders[rear].total = orders[rear].price * qty;
    dailySales += orders[rear].total;
    totalOrdersPlaced++; // FIX: Keep track of every successful order

    printf("\n===== BILL =====\n");
    printf("Token Number : %d\n", orders[rear].token);
    printf("Item         : %s\n", orders[rear].item);
    printf("Quantity     : %d\n", orders[rear].quantity);
    printf("Total Amount : Rs %.2f\n", orders[rear].total);

    FILE *fp;
    fp = fopen("sales.txt", "a");

    if(fp != NULL) {
        fprintf(fp, "Token:%d Item:%s Qty:%d Total:%.2f\n",
                orders[rear].token,
                orders[rear].item,
                orders[rear].quantity,
                orders[rear].total);

        fclose(fp);
    }
}

void displayQueue() {
    int i;

    if(front > rear) {
        printf("\nNo Orders in Queue!\n");
        return;
    }

    printf("\n===== ORDER QUEUE =====\n");

    for(i = front; i <= rear; i++) {
        printf("Token: %d | Item: %s | Qty: %d\n",
               orders[i].token,
               orders[i].item,
               orders[i].quantity);
    }
}

void serveOrder() {
    if(front > rear) {
        printf("\nNo Orders to Serve!\n");
        return;
    }

    printf("\nServing Token Number %d\n", orders[front].token);
    front++;
}

void salesReport() {
    printf("\n===== DAILY SALES REPORT =====\n");
    printf("Total Sales: Rs %.2f\n", dailySales);
    printf("Total Orders Processed Today: %d\n", totalOrdersPlaced); // FIX: Displays correct history
    
    // Optional info:
    int currentQueueSize = (front > rear) ? 0 : (rear - front + 1);
    printf("Orders Currently Waiting: %d\n", currentQueueSize);
}

int main() {
    setbuf(stdout, NULL);
    int choice;

    while(1) {
        printf("\n===== SMART CANTEEN SYSTEM =====\n");
        printf("1. Display Menu\n");
        printf("2. Place Order\n");
        printf("3. Display Queue\n");
        printf("4. Serve Order\n");
        printf("5. Daily Sales Report\n");
        printf("6. Exit\n");

        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch(choice) {
            case 1:
                displayMenu();
                break;

            case 2:
                placeOrder();
                break;

            case 3:
                displayQueue();
                break;

            case 4:
                serveOrder();
                break;

            case 5:
                salesReport();
                break;

            case 6:
                printf("Exiting Program...\n");
                return 0;

            default:
                printf("Invalid Choice!\n");
        }
    }

    return 0;
}