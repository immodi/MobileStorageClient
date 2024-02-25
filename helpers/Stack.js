export default class Stack {
    constructor(...initialItems) {
        this.items = [...initialItems];
    }
    peek() {
        return this.isEmpty() ? 1 : this.items[this.items.length - 1];
    }
    
    push(element) {
        if (this.peek() === element) {
            return this
        }
        this.items.push(element);
        return new Stack(...this.items);
    }

    pop() {
        if (this.size() === 1 || this.size() === 0) {
            return this;
        }
        
        this.items.pop();
        return new Stack(...this.items);
    }
    
    isEmpty() {
        if (this.size() === 0) {
            return true;
        } else {
            return false;
        }
    }

    size() {
        return this.items.length;
    }
  
    clear() {
        this.items = [];
    }
  
  }  