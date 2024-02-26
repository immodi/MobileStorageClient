export default class Stack {
    constructor(...initialItems) {
        this.items = [...initialItems];
    }
    peek() {
        return this.isEmpty() ? null : this.items[this.items.length - 1];
    }
    
    push(element) {
        if (this.peek() === element) {
            return null
        }
        
        this.items.push(element);
        return new Stack(...this.items);
    }

    pop() {
        if (this.size() === 1) {
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