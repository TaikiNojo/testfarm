import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import {ThemeProvider} from 'styled-components'
import { Button, Modal, dark ,light} from '@lukkasromero/cswap-uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (tokenAddress: string, amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  tokenAddress: string
}

const BuyModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', tokenAddress }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <ThemeProvider theme={light}>
      <Modal title="Buy Tokens" onDismiss={onDismiss}>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
        />
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss}>
            {TranslateString(462, 'Cancel')}
          </Button>
          <Button
            disabled={pendingTx}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(tokenAddress, val)
              setPendingTx(false)
              onDismiss()
            }}
          >
            {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
          </Button>
        </ModalActions>
      </Modal>
    </ThemeProvider>
  )
}

export default BuyModal
