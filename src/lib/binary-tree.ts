class TreeNode {
    data: string;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(data: string) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

export class BinaryTree {
    root: TreeNode | null;

    constructor() {
        this.root = null;
    }

    insert(data: string) {
        if (!this.root) {
            this.root = new TreeNode(data);
        } else {
            this.root = this.recursiveInsert(this.root, data);
        }
    }

    recursiveInsert(root: TreeNode | null, data: string) {
        if (!root) {
            return new TreeNode(data);
        }

        if (data === root.data) {
            return root;
        }

        if (data < root.data) {
            root.left = this.recursiveInsert(root.left, data);
        } else {
            root.right = this.recursiveInsert(root.right, data);
        }
        return root;
    }

    find(data: string) {
        return this.recursiveFind(this.root, data);
    }

    recursiveFind(root: TreeNode | null, data: string): boolean {
        if (!root) {
            return false;
        }

        if (root.data === data) {
            return true;
        } else if (data < root.data) {
            return this.recursiveFind(root.left, data);
        } else {
            return this.recursiveFind(root.right, data);
        }
    }
}