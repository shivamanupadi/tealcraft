export const ARC72Contract = {
  name: "ARC72",
  source: `type Bytes256 = bytes<256>;
type Token = { owner: Address; uri: Bytes256; controller: Address };
type Control = { owner: Address; controller: Address };

// eslint-disable-next-line no-unused-vars
class ARC72 extends Contract {
  index = GlobalStateKey<uint256>();

  tokenBox = BoxMap<uint256, Token>();

  controlBox = BoxMap<Control, bytes>();

  /**
   *
   * Returns the address of the current owner of the NFT with the given tokenId
   *
   * @param tokenId The ID of the NFT
   * @returns The current owner of the NFT
   */
  @abi.readonly
  arc72_ownerOf(tokenId: uint256): Address {
    return this.tokenBox(tokenId).value.owner;
  }

  /**
   *
   * Returns a URI pointing to the NFT metadata
   *
   * @param tokenId The ID of the NFT
   * @returns URI to token metadata
   */
  @abi.readonly
  arc72_tokenURI(tokenId: uint256): Bytes256 {
    return this.tokenBox(tokenId).value.uri;
  }

  private transferTo(to: Address, tokenId: uint256): void {
    this.tokenBox(tokenId).value.owner = to;
  }

  /**
   * Transfers ownership of an NFT
   */
  arc72_transferFrom(_from: Address, to: Address, tokenId: uint256): void {
    const token = this.tokenBox(tokenId).value;

    const key: Control = { owner: this.txn.sender, controller: _from };

    if (this.txn.sender === _from || this.txn.sender === token.controller || this.controlBox(key).exists) {
      this.transferTo(to, tokenId);
    } else throw Error('Transfer not authorized');
  }

  /**
   *
   * Approve a controller for a single NFT
   *
   * @param approved Approved controller address
   * @param tokenId The ID of the NFT
   */
  arc72_approve(approved: Address, tokenId: uint256): void {
    this.tokenBox(tokenId).value.controller = approved;
  }

  /**
   *
   * Approve an operator for all NFTs for a user
   *
   * @param operator Approved operator address
   * @param approved true to give approval, false to revoke
   * @returns
   */
  arc72_setApprovalForAll(operator: Address, approved: boolean): void {
    const key: Control = { owner: this.txn.sender, controller: operator };

    if (approved) this.controlBox(key).value = '';
    else if (this.controlBox(key).exists) this.controlBox(key).delete();
  }

  mint(to: Address): void {
    const index = this.index.value;

    const token: Token = {
      owner: to,
      uri: 'https://github.com/algorandfoundation/ARCs' as Bytes256,
      controller: Address.zeroAddress,
    };

    this.tokenBox(index).value = token;
    this.transferTo(to, index);
    this.index.value = index + 1;
  }

  /**
   * Returns the number of NFTs currently defined by this contract
   */
  @abi.readonly
  arc72_totalSupply(): uint256 {
    return this.index.value;
  }

  /**
   * Returns the token ID of the token with the given index among all NFTs defined by the contract
   */
  @abi.readonly
  arc72_tokenByIndex(index: uint256): uint256 {
    return index;
  }
}`,
};
