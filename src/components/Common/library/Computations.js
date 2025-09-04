export class Computations {
  static calculate(items_data, tax_method, discount_data, discount_level) {
    // console.log({"items_data" : items_data, tax_method, "discount_level" : discount_level, "discount_data" : discount_data})
    return this.calculateTotal(
      items_data,
      tax_method,
      discount_level,
      discount_data
    );
  }

  static calculateTotal(
    items_data,
    tax_method,
    discount_level,
    total_discount_data
  ) {
    let subtotal = 0;
    let tax_amount = 0;
    let tax_amounts = [];
    let discount_amount = 0;

    items_data.map((item, index) => {
      let quantity = item.quantity;
      let rate = Math.round(item.rate * 100) / 100;
      let amount = quantity * rate;
      let discount_data = item?.discount;
      let tax_data = item?.tax_rate;

      let discount_amount_for_each_item = 0;

      if (discount_data) {
        discount_amount_for_each_item =
          discount_data?.type === "percent"
            ? (discount_data?.value * amount) / 100
            : discount_data?.value;
        discount_amount = discount_amount + discount_amount_for_each_item;
      }

      let item_amount =
        amount - Math.round(discount_amount_for_each_item * 100) / 100;

      item.amount = item_amount.toFixed(2);

      subtotal = subtotal + item_amount;

      let item_tax_amount = 0;

      if (tax_data) {
        let computation = tax_data.computation;
        if (computation === "percent" && tax_method === "tax_inclusive") {
          let tax_rate = tax_data.rate;
          item_tax_amount = (item_amount * tax_rate) / (100 + tax_rate);
          tax_amounts[tax_rate] =
            (tax_amounts[tax_rate] ? tax_amounts[tax_rate] : 0) +
            Math.round(item_tax_amount * 100) / 100;
        }
        if (computation === "percent" && tax_method === "tax_exclusive") {
          let tax_rate = tax_data.rate;
          item_tax_amount = (item_amount * tax_rate) / 100;
          tax_amounts[tax_rate] =
            (tax_amounts[tax_rate] ? tax_amounts[tax_rate] : 0) +
            Math.round(item_tax_amount * 100) / 100;
        }
      }

      tax_amount = tax_amount + Math.round(item_tax_amount * 100) / 100;
    });

    let total = subtotal;
    if (tax_method === "tax_exclusive") {
      total = total + tax_amount;
    }

    if (discount_level === "total") {
      if (total_discount_data) {
        discount_amount =
          total_discount_data.type === "percent"
            ? (total * total_discount_data?.value) / 100
            : total_discount_data?.value;
        discount_amount = Math.round(discount_amount * 100) / 100;
        total = total - discount_amount;
      }
    }

    return {
      tax_amount: tax_amount,
      tax_amounts: tax_amounts,
      discount_amount: discount_amount,
      subtotal: subtotal,
      total: total,
    };
  }

  static exchange(
    items_data,
    discount_level,
    old_exchange_rate,
    new_exchange_rate
  ) {

    let data = [];
    items_data.map((item) => {
      item.rate = (item.rate * old_exchange_rate).toFixed(2);
      item.rate = (item.rate / new_exchange_rate).toFixed(2);
      if (discount_level === "item") {
        let amount = item.quantity * item.rate;
        let discount_data = item?.discount;
        if (discount_data?.value) {
          item.amount =
            discount_data.type === "percent"
              ? (amount - (amount * discount_data?.value) / 100).toFixed(2)
              : (amount - discount_data?.value).toFixed(2);
        } else {
          item.amount = amount;
        }
      }
      data.push(item);
    });
    return data;
  }
}
